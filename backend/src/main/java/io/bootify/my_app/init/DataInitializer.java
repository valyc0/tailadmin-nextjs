package io.bootify.my_app.init;

import io.bootify.my_app.model.Product;
import io.bootify.my_app.repos.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            Product laptop = new Product();
            laptop.setName("MacBook Pro");
            laptop.setDescription("13-inch, M2 chip, 8GB RAM, 256GB SSD");
            laptop.setPrice(new BigDecimal("1299.99"));
            laptop.setStockQuantity(10);
            laptop.setActive(true);

            Product phone = new Product();
            phone.setName("iPhone 15");
            phone.setDescription("128GB, Midnight Black");
            phone.setPrice(new BigDecimal("999.99"));
            phone.setStockQuantity(15);
            phone.setActive(true);

            Product tablet = new Product();
            tablet.setName("iPad Air");
            tablet.setDescription("10.9-inch, Wi-Fi, 64GB");
            tablet.setPrice(new BigDecimal("599.99"));
            tablet.setStockQuantity(20);
            tablet.setActive(true);

            Product watch = new Product();
            watch.setName("Apple Watch Series 9");
            watch.setDescription("GPS, 45mm Aluminum Case");
            watch.setPrice(new BigDecimal("399.99"));
            watch.setStockQuantity(25);
            watch.setActive(true);

            Product airpods = new Product();
            airpods.setName("AirPods Pro");
            airpods.setDescription("2nd Generation with MagSafe Charging Case");
            airpods.setPrice(new BigDecimal("249.99"));
            airpods.setStockQuantity(30);
            airpods.setActive(true);

            productRepository.saveAll(Arrays.asList(laptop, phone, tablet, watch, airpods));
        }
    }
}