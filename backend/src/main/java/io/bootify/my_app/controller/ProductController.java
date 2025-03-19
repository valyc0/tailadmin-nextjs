package io.bootify.my_app.controller;

import io.bootify.my_app.dto.ProductDTO;
import io.bootify.my_app.model.Product;
import io.bootify.my_app.repos.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Map Entity to DTO
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setActive(product.getActive());
        return dto;
    }

    // Map DTO to Entity
    private Product mapToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setActive(dto.getActive());
        return product;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) Boolean activeOnly) {
        List<Product> products = activeOnly != null && activeOnly 
            ? productRepository.findByActiveTrue()
            : productRepository.findAll();
            
        List<ProductDTO> productDTOs = products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(productDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        productDTO.setId(null); // Ensure we're creating a new product
        Product product = mapToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapToDTO(savedProduct));
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productDTO.setId(id);
        Product product = mapToEntity(productDTO);
        Product updatedProduct = productRepository.save(product);
        
        return ResponseEntity.ok(mapToDTO(updatedProduct));
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepository.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        
        return productRepository.findById(id)
                .map(product -> {
                    product.setStockQuantity(quantity);
                    return ResponseEntity.ok(mapToDTO(productRepository.save(product)));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}