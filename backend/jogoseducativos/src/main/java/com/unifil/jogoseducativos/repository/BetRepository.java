package com.unifil.jogoseducativos.repository;

import com.unifil.jogoseducativos.models.Bet;
import com.unifil.jogoseducativos.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    List<Bet> findByUser(User user);
}
