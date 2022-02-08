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
    fun addProduct(@RequestBody json: Map<String, String> ): Product {
        val productName = json["productName"] ?: error("no product name passed")
        val modelNumber = json["modelNumber"]?.toInt() ?: error("no model number passed")
        return productService.addProduct(productName, modelNumber)
    }


    @PostMapping("/add/{productId}/{quantityToAdd}")
    fun addQuantity(@PathVariable productId: Long, @PathVariable quantityToAdd: Int) : Int =
        productService.addQuantity(productId, quantityToAdd).quantity

    @PostMapping("/order/{productId}/{requestedQuantity}")
    fun placeOrder(@PathVariable productId: Long, @PathVariable requestedQuantity: Int) : Int =
        productService.placeOrder(productId, requestedQuantity)
}

