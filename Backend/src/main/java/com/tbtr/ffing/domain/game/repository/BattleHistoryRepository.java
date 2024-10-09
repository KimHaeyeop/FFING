package com.tbtr.ffing.domain.game.repository;

import com.tbtr.ffing.domain.game.entity.BattleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BattleHistoryRepository extends JpaRepository<BattleHistory, Long> {

    @Query("SELECT bh FROM BattleHistory bh WHERE bh.pet1Id = :petId or bh.pet2Id = :petId ORDER BY bh.createdAt DESC LIMIT 5")
    List<BattleHistory> getRecent5BattleHistoriesByPetId(Long petId);

}
