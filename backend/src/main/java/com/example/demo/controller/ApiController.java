package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/public/status")
    public String publicStatus() {
        return "Backend operativo (Público)";
    }

    @GetMapping("/pedidos")
    public String getPedidos(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("email");
        return "Lista de pedidos para el usuario verificado: " + username;
    }
}
