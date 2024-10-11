package com.tbtr.ffing.domain.game.repository;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.repository.AssetRepositoryCustom;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PetRepository extends JpaRepository<PetInfo, Long>, PetRepositoryCustom {
    Optional<PetInfo> findFirstByUserOrderByPetInfoIdDesc(User user);
}
