package com.tbtr.ffing.domain.game.repository;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.repository.AssetRepositoryCustom;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<PetInfo, Long>, PetRepositoryCustom {
}
