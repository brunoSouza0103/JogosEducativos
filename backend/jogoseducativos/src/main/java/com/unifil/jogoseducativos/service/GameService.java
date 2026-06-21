package com.unifil.jogoseducativos.service;

import com.unifil.jogoseducativos.models.Bet;
import com.unifil.jogoseducativos.models.User;
import com.unifil.jogoseducativos.repository.BetRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class GameService {

    private final Random random = new Random();
    private final BetRepository betRepository;

    public GameService(BetRepository betRepository) {
        this.betRepository = betRepository;
    }

    public Bet recordBet(User user, BigDecimal amount, BigDecimal multiplier, Boolean won) {
        Bet bet = new Bet(user, amount, multiplier, won);
        return betRepository.save(bet);
    }

    public List<Bet> getHistory(User user) {
        return betRepository.findByUser(user);
    }

    public Bet startBet(User user, BigDecimal amount) {

        double r = random.nextDouble();
        double crash = 1.05 + Math.pow(r, 3) * 6.0;

        Bet bet = new Bet(user, amount, BigDecimal.ONE, false);

        bet.setCrashPoint(BigDecimal.valueOf(crash));
        bet.setStartTimeEpoch(Instant.now().getEpochSecond());
        bet.setStatus("playing");

        return betRepository.save(bet);
    }

    public Optional<Bet> findById(Long id) {
        return betRepository.findById(id);
    }

    public Bet updateBetStatus(Bet bet) {

        if (bet == null) {
            throw new IllegalArgumentException("bet is null");
        }

        if (!"playing".equals(bet.getStatus())) {
            return bet;
        }

        long start = bet.getStartTimeEpoch();
        double elapsed = Instant.now().getEpochSecond() - start;

        double currentMultiplier = Math.exp(0.04 * elapsed);

        if (currentMultiplier >= bet.getCrashPoint().doubleValue()) {

            bet.setMultiplier(bet.getCrashPoint());
            bet.setWon(false);
            bet.setStatus("crashed");

            return betRepository.save(bet);
        }

        return bet;
    }

    public Bet resolveCashout(Bet bet) {

        if (bet == null) {
            throw new IllegalArgumentException("bet is null");
        }

        bet = updateBetStatus(bet);

        if ("crashed".equals(bet.getStatus())) {
            return bet;
        }

        long start = bet.getStartTimeEpoch();
        double elapsed = Instant.now().getEpochSecond() - start;

        double currentMultiplier = Math.exp(0.04 * elapsed);

        bet.setMultiplier(BigDecimal.valueOf(currentMultiplier));
        bet.setWon(true);
        bet.setStatus("won");

        return betRepository.save(bet);
    }
}