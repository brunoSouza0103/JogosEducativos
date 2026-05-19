package com.unifil.jogoseducativos.models;

public class Dealer extends Person {
    private Cards mao;

    public Dealer() {
    }

    public Dealer(Cards mao) {
        this.mao = mao;
    }

    public Cards getMao() {
        return mao;
    }

    public void setMao(Cards mao) {
        this.mao = mao;
    }
}
