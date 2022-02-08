package mil.army.futures.asitemplate.controllers

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.services.ProductService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/products")
class ProductController(private val productService: ProductService) {

    @GetMapping
    fun getProducts(): List<Product> =
        productService.getProducts()

    @PostMapping
    fun addProduct(@RequestBody product: String): Product =
         productService.addProduct(product)


    @PostMapping("/add/{productId}/{quantityToAdd}")
    fun addQuantity(@PathVariable productId: Long, @PathVariable quantityToAdd: Int) : Int =
        productService.addQuantity(productId, quantityToAdd).quantity
}

