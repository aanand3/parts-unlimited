package mil.army.futures.asitemplate.services

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ProductService(private val productRepository: ProductRepository) {
    fun addProduct(product: String, modelNumber: Int): Product {
        return productRepository.save(Product(name = product, quantity = 0, modelNumber = modelNumber))
    }

    fun getProducts(): List<Product> {
        return productRepository.findAll()
    }

    fun addQuantity(productId: Long, quantityToAdd: Int): Product {
        val existingProduct = productRepository.findByIdOrNull(productId) ?: error("product does not exist")
        val newProduct = existingProduct.copy(quantity = existingProduct.quantity + quantityToAdd)
        return productRepository.save(newProduct)
    }

    fun placeOrder(productId: Long, requestedQuantity: Int): Int {
        val existingProduct = productRepository.findByIdOrNull(productId) ?: error("product does not exist")

        val itemsRemaining = existingProduct.quantity - requestedQuantity
        if (itemsRemaining >= 0) {
            val productWithQuantitySubtracted = existingProduct.copy(
                quantity = itemsRemaining
            )
            productRepository.save(productWithQuantitySubtracted)
        } else {
            val productWithNoItemsRemaining = existingProduct.copy(
                quantity = 0
            )
            productRepository.save(productWithNoItemsRemaining)
        }
        return itemsRemaining
    }
}