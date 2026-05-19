package com.unifil.jogoseducativos.models;

public class Player extends Person {
    private Cards mao;
    private int pontos;

    public Player() {
    }

    public Player(Cards mao, int pontos) {
        this.mao = mao;
        this.pontos = pontos;
    }

    public Cards getMao() {
        return mao;
    }

    public void setMao(Cards mao) {
        this.mao = mao;
    }

    public int getPontos() {
        return pontos;
    }

    public void setPontos(int pontos) {
        this.pontos = pontos;
    }
}
