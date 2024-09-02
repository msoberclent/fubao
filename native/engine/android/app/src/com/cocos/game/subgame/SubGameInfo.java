package com.cocos.game.subgame;

public class SubGameInfo {

    private String token;

    private String gameUrl;

    private Long gameId;

    private String exitRequestUrl;

    private String uid;

    private Integer direction;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getGameUrl() {
        return gameUrl;
    }

    public void setGameUrl(String gameUrl) {
        this.gameUrl = gameUrl;
    }

    public Integer getDirection() {
        return direction;
    }

    public void setDirection(Integer direction) {
        this.direction = direction;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getExitRequestUrl() {
        return exitRequestUrl;
    }

    public void setExitRequestUrl(String exitRequestUrl) {
        this.exitRequestUrl = exitRequestUrl;
    }
}
