package com.unifil.jogoseducativos.controllers;

import com.unifil.jogoseducativos.dto.BetRequest;
import com.unifil.jogoseducativos.dto.BetResponse;
import com.unifil.jogoseducativos.dto.CashoutRequest;
import com.unifil.jogoseducativos.models.Bet;
import com.unifil.jogoseducativos.models.User;
import com.unifil.jogoseducativos.service.GameService;
import com.unifil.jogoseducativos.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.time.Instant;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;
    private final UserService userService;

    public GameController(GameService gameService, UserService userService) {
        this.gameService = gameService;
        this.userService = userService;
    }

    @PostMapping("/start")
    public ResponseEntity<BetResponse> startGame(@RequestBody BetRequest request) {
        User user = userService.findById(request.getUserId()).orElseThrow();
        if (request.getAmount() == null || request.getAmount().doubleValue() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (user.getBalance().compareTo(request.getAmount()) < 0) {
            return ResponseEntity.status(402).build();
        }

        user.setBalance(user.getBalance().subtract(request.getAmount()));
        userService.register(user);

        Bet bet = gameService.startBet(user, request.getAmount());

        BetResponse response = new BetResponse();
        response.setBetId(bet.getId());
        response.setAmount(bet.getAmount());
        response.setStatus(bet.getStatus());
        response.setBalance(user.getBalance());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<BetResponse> status(@RequestParam Long betId) {

        Bet bet = gameService.findById(betId).orElseThrow();

        // Atualiza o estado da aposta (verifica crash)
        bet = gameService.updateBetStatus(bet);

        BigDecimal multiplier;

        if ("crashed".equals(bet.getStatus())) {

            multiplier = bet.getCrashPoint();

        } else {

            long start = bet.getStartTimeEpoch();
            double elapsed = Instant.now().getEpochSecond() - start;

            multiplier = BigDecimal.valueOf(
                    Math.exp(0.04 * elapsed));
        }

        BetResponse response = new BetResponse();
        response.setBetId(bet.getId());
        response.setAmount(bet.getAmount());
        response.setMultiplier(multiplier);
        response.setStatus(bet.getStatus());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cashout")
    public ResponseEntity<BetResponse> cashout(@RequestBody CashoutRequest request) {

        User user = userService.findById(request.getUserId()).orElseThrow();

        Bet bet = gameService.findById(request.getBetId()).orElseThrow();

        bet = gameService.updateBetStatus(bet);

        BetResponse response = new BetResponse();

        if (!"playing".equals(bet.getStatus())) {            
            response.setBetId(bet.getId());
            response.setAmount(bet.getAmount());
            response.setMultiplier(bet.getMultiplier());
            response.setWon(bet.getWon());
            response.setBalance(user.getBalance());
            response.setStatus(bet.getStatus());
        }

            return ResponseEntity.ok(response);

    }

    @GetMapping("/history")
    public ResponseEntity<List<BetResponse>> history(@RequestParam Long userId) {
        User user = userService.findById(userId).orElseThrow();
        List<BetResponse> result = gameService.getHistory(user).stream().map(bet -> {
            BetResponse response = new BetResponse();
            response.setBetId(bet.getId());
            response.setAmount(bet.getAmount());
            response.setMultiplier(bet.getMultiplier());
            response.setWon(bet.getWon());
            response.setBalance(user.getBalance());
            return response;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
