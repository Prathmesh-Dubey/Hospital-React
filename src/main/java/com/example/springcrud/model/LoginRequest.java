package com.example.springcrud.model;

public class LoginRequest {

    private String phone;
    private String email;
    private String password;

    public LoginRequest() {}

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
