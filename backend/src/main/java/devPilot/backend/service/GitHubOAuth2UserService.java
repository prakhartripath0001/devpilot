package devPilot.backend.service;

import devPilot.backend.entity.User;
import devPilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final TextEncryptor tokenEncryptor;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Long githubId = oAuth2User.getAttribute("id") instanceof Integer id
                ? id.longValue()
                : ((Number) oAuth2User.getAttribute("id")).longValue();

        String login = oAuth2User.getAttribute("login");
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String scopes = String.join(",", userRequest.getAccessToken().getScopes());

        String displayName = (name != null && !name.isBlank()) ? name : login;

        User user = userRepository.findByGithubId(githubId)
                .map(existingUser -> {
                    existingUser.setGithubUsername(login);
                    existingUser.setDisplayName(displayName);
                    existingUser.setAvatarUrl(avatarUrl);
                    existingUser.setAccessToken(tokenEncryptor.encrypt(accessToken));
                    existingUser.setTokenScope(scopes);
                    log.info("Updated existing user: {}", login);
                    return existingUser;
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .githubId(githubId)
                            .githubUsername(login)
                            .displayName(displayName)
                            .avatarUrl(avatarUrl)
                            .accessToken(tokenEncryptor.encrypt(accessToken))
                            .tokenScope(scopes)
                            .build();
                    log.info("Created new user: {}", login);
                    return newUser;
                });

        userRepository.save(user);

        return oAuth2User;
    }
}
