package devPilot.backend.service;

import devPilot.backend.entity.User;
import devPilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TextEncryptor tokenEncryptor;

    @Transactional(readOnly = true)
    public User requiredById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public String decryptAccessToken(User user) {
        return tokenEncryptor.decrypt(user.getAccessToken());
    }

    @Transactional
    public User upsertFromGithub(Map<String, Object> attributes, String accessToken, String tokenScope) {
        Long githubId = attributes.get("id") instanceof Integer id
                ? id.longValue()
                : ((Number) attributes.get("id")).longValue();

        String login = (String) attributes.get("login");
        String name = (String) attributes.get("name");
        String avatarUrl = (String) attributes.get("avatar_url");
        String displayName = (name != null && !name.isBlank()) ? name : login;

        User user = userRepository.findByGithubId(githubId)
                .map(existingUser -> {
                    existingUser.setGithubUsername(login);
                    existingUser.setDisplayName(displayName);
                    existingUser.setAvatarUrl(avatarUrl);
                    existingUser.setAccessToken(tokenEncryptor.encrypt(accessToken));
                    existingUser.setTokenScope(tokenScope);
                    return existingUser;
                })
                .orElseGet(() -> User.builder()
                        .githubId(githubId)
                        .githubUsername(login)
                        .displayName(displayName)
                        .avatarUrl(avatarUrl)
                        .accessToken(tokenEncryptor.encrypt(accessToken))
                        .tokenScope(tokenScope)
                        .build());
        return userRepository.save(user);
    }
}
