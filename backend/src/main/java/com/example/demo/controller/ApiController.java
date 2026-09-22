package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiController {

    private List<Map<String, Object>> pedidos = new ArrayList<>();

    public ApiController() {
        // Inicializar con pedidos de prueba
        Map<String, Object> p1 = new HashMap<>();
        p1.put("id", "PED-1001");
        p1.put("producto", "Laptop AWS Cloud");
        p1.put("total", 1200.50);
        p1.put("estado", "Entregado");
        p1.put("despacho", LocalDate.now().minusDays(5).toString());
        p1.put("entrega", LocalDate.now().minusDays(1).toString());
        pedidos.add(p1);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("id", "PED-1002");
        p2.put("producto", "Teclado Mecánico");
        p2.put("total", 85.00);
        p2.put("estado", "En Tránsito");
        p2.put("despacho", LocalDate.now().minusDays(1).toString());
        p2.put("entrega", LocalDate.now().plusDays(3).toString());
        pedidos.add(p2);
    }

    @GetMapping("/pedidos")
    public List<Map<String, Object>> getPedidos(@AuthenticationPrincipal Jwt jwt) {
        return pedidos;
    }

    @PostMapping("/pedidos")
    public Map<String, Object> crearPedido(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> nuevoPedido) {
        nuevoPedido.put("id", "PED-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        nuevoPedido.put("estado", "Pendiente");
        nuevoPedido.put("despacho", LocalDate.now().plusDays(1).toString());
        nuevoPedido.put("entrega", LocalDate.now().plusDays(5).toString());
        pedidos.add(nuevoPedido);
        return nuevoPedido;
    }
}
