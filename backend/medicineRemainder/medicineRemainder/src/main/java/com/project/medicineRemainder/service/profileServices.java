package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.Entity.profile;
import com.project.medicineRemainder.dto.profileDto;
import com.project.medicineRemainder.repository.profileRepo;
import com.project.medicineRemainder.repository.userrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class profileServices {
        private final profileRepo profileRepository;
        private final userrepo userRepository;

        // ─── Create ──────────────────────────────────

    public profileDto createOrUpdateProfile(Long userId, profileDto dto) {
        // Profile exist karti hai toh update, nahi toh create
        boolean exists = profileRepository.existsByUserId(userId);
        if (exists) {
            return updateProfile(userId, dto);
        } else {
            return createProfile(userId, dto);
        }
    }
        public profileDto createProfile(Long userId, profileDto dto) {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User nahi mila: " + userId));

            if (profileRepository.existsByUserId(userId)) {
                throw new RuntimeException("Profile pehle se exist karti hai, update use karo");
            }

            profile p = mapToEntity(dto);
            p.setUser(user);

            return mapToDto(profileRepository.save(p));
        }

        // ─── Update ──────────────────────────────────

        public profileDto updateProfile(Long userId, profileDto dto) {

            profile p = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile nahi mili: " + userId));

            if (dto.getName() != null)                  p.setName(dto.getName());
            if (dto.getEmail() != null)                 p.setEmail(dto.getEmail());
            if (dto.getPhone() != null)                 p.setPhone(dto.getPhone());
            if (dto.getGender() != null)                p.setGender(dto.getGender());
            if (dto.getDateOfBirth() != null)           p.setDateOfBirth(dto.getDateOfBirth());
            if (dto.getAddressLine() != null)           p.setAddressLine(dto.getAddressLine());
            if (dto.getCity() != null)                  p.setCity(dto.getCity());
            if (dto.getState() != null)                 p.setState(dto.getState());
            if (dto.getPincode() != null)               p.setPincode(dto.getPincode());
            if (dto.getBloodGroup() != null)            p.setBloodGroup(dto.getBloodGroup());
            if (dto.getEmergencyContactName() != null)  p.setEmergencyContactName(dto.getEmergencyContactName());
            if (dto.getEmergencyContactPhone() != null) p.setEmergencyContactPhone(dto.getEmergencyContactPhone());
            if(dto.getAge()!=null)p.setAge(dto.getAge());
            return mapToDto(profileRepository.save(p));
        }

        // ─── Get ─────────────────────────────────────

        public profileDto getProfile(Long userId) {
            profile p = profileRepository.findByUserId(userId).orElse(null);
            if (p == null) {
                profileDto dto = new profileDto();
                userRepository.findById(userId).ifPresent(u -> {
                    dto.setName(u.getName());
                    dto.setEmail(u.getEmail());
                });
                return dto;
            }
            return mapToDto(p);
        }

        // ─── Entity → DTO ────────────────────────────
        private profileDto mapToDto(profile p) {
            profileDto dto = new profileDto();
            dto.setName(p.getName());
            dto.setEmail(p.getEmail());
            dto.setPhone(p.getPhone());
            dto.setGender(p.getGender());
            dto.setDateOfBirth(p.getDateOfBirth());
            dto.setAddressLine(p.getAddressLine());
            dto.setCity(p.getCity());
            dto.setState(p.getState());
            dto.setPincode(p.getPincode());
            dto.setBloodGroup(p.getBloodGroup());
            dto.setEmergencyContactName(p.getEmergencyContactName());
            dto.setEmergencyContactPhone(p.getEmergencyContactPhone());
            dto.setAge(p.getAge());
            return dto;
        }

        // ─── DTO → Entity ────────────────────────────
        private profile mapToEntity(profileDto dto) {
            profile p = new profile();
            p.setName(dto.getName());
            p.setEmail(dto.getEmail());
            p.setPhone(dto.getPhone());
            p.setGender(dto.getGender());
            p.setDateOfBirth(dto.getDateOfBirth());
            p.setAddressLine(dto.getAddressLine());
            p.setCity(dto.getCity());
            p.setState(dto.getState());
            p.setPincode(dto.getPincode());
            p.setBloodGroup(dto.getBloodGroup());
            p.setEmergencyContactName(dto.getEmergencyContactName());
            p.setEmergencyContactPhone(dto.getEmergencyContactPhone());
            p.setAge(dto.getAge());
            return p;
        }
    }

