package io.bootify.my_app.repos;

import io.bootify.my_app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByActiveTrue();
    
    @Modifying
    @Query("UPDATE Product p SET p.active = false WHERE p.id = :id")
    void softDelete(Long id);
}