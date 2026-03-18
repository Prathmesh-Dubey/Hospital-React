package com.example.springcrud.model;

public class LoginResponse {

    private String message;
    private String userId;
    private String name;
    private String role;
    private String doctorId;

    // OLD constructor (keep this)
    public LoginResponse(String message, String userId, String name, String role) {
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    // NEW constructor (only when needed)
    public LoginResponse(String message, String userId, String name, String role, String doctorId) {
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.doctorId = doctorId;
    }

    public String getMessage() {
        return message;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getDoctorId() {
        return doctorId;
    }
}
