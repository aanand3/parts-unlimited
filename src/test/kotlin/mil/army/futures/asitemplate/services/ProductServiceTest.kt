package mil.army.futures.asitemplate.services

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.repository.findByIdOrNull

@ExtendWith(MockKExtension::class)
internal class ProductServiceTest {
    @MockK
    lateinit var productRepository: ProductRepository

    @InjectMockKs
    lateinit var productService: ProductService

    @Test
    fun `should retrieve all products`() {
        val expectedProducts = listOf(Product(1L, "first-product", 0, 234), Product(2L, "second-product", 0, 456))
        every { productRepository.findAll() } returns expectedProducts

        val actualProducts: List<Product> = productService.getProducts()

        assertThat(actualProducts).isEqualTo(expectedProducts)
    }

    @Test
    fun `should create a new product`() {
        every { productRepository.save(any()) } answers { firstArg() }
        val productName = "first-product"
        val modelNumber = 234
        val productToSave = Product(name = productName, quantity = 0, modelNumber = modelNumber)

        productService.addProduct(productName, modelNumber)

        verify { productRepository.save(productToSave) }
    }

    @Test
    fun `should update the quantity of a product`() {
        val quantityToAdd = 17
        val existingProduct = Product(33,"first-product", 7, 234)
        val productWithQuantityAdded = existingProduct.copy(quantity = existingProduct.quantity + quantityToAdd)

        every { productRepository.findByIdOrNull(existingProduct.id) } returns existingProduct
        every { productRepository.save(any()) } answers { firstArg() }

        val result = productService.addQuantity(existingProduct.id, quantityToAdd)

        verify { productRepository.save(productWithQuantityAdded) }
        assertThat(result).isEqualTo(productWithQuantityAdded)
    }

    @Test
    fun `should return the amount remaining if the order was totally fulfilled`() {
        val existingQuantity = 10
        val requestedQuantity = 3
        val existingProduct = Product(33,"first-product", existingQuantity, 234)
        val productWithQuantitySubtracted = existingProduct.copy(
            quantity = existingProduct.quantity - requestedQuantity
        )

        every {productRepository.findByIdOrNull(existingProduct.id)} returns existingProduct
        every { productRepository.save(any()) } answers { firstArg() }

        val result = productService.placeOrder(existingProduct.id, requestedQuantity)

        verify { productRepository.save(productWithQuantitySubtracted)}
        assertThat(result).isEqualTo(existingQuantity-requestedQuantity)
    }

    @Test
    fun `should return the amount unfulfilled if there were too few items`() {
        val existingQuantity = 10
        val requestedQuantity = 13
        val existingProduct = Product(33,"first-product", existingQuantity, 234)
        val productWithNoItemsRemaining = existingProduct.copy(
            quantity = 0
        )

        every {productRepository.findByIdOrNull(existingProduct.id)} returns existingProduct
        every { productRepository.save(any()) } answers { firstArg() }

        val result = productService.placeOrder(existingProduct.id, requestedQuantity)

        verify { productRepository.save(productWithNoItemsRemaining)}
        assertThat(result).isEqualTo(existingQuantity - requestedQuantity)
    }
}
