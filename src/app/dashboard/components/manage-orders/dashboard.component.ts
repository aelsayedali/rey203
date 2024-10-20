import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  ProductsService,
  Product,
  CartItem,
} from '../../../services/products.service';
import {
  DashboardService,
  
} from '../../../services/dashboard.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  cartItems: CartItem[] = [];
  errorMessage: string | null = null;

  constructor(private productsService: ProductsService , private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCartItems();
  }

  loadProducts() {
    try {
      this.products = this.productsService.getAllProducts();
      console.log(this.products);
    } catch (error) {
      this.errorMessage = 'Failed to load products. Please try again later.';
    }
  }

  loadCartItems() {
   try {
     this.cartItems = this.dashboardService.loadCartItems();
     console.log(this.cartItems);
   } catch (error) {
     this.errorMessage = 'Failed to load orders. Please try again later.';
   }
  }

  editProduct(product: Product) {
    Swal.fire({
      title: 'Edit Product',
      html: `
      <input id="name" class="swal2-input" placeholder="Product Name" value="${product.name}">
      <input id="price" class="swal2-input" placeholder="Product Price" type="number" value="${product.price}">
      <textarea id="description" class="swal2-textarea" placeholder="Product Description">${product.description}</textarea>
      <input id="status" class="swal2-input" placeholder="Product Status" value="${product.status}">
    `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement)
          .value;
        const price = (document.getElementById('price') as HTMLInputElement)
          .value;
        const description = (
          document.getElementById('description') as HTMLTextAreaElement
        ).value;
        const status = (document.getElementById('status') as HTMLInputElement)
          .value;
        if (!name || !price || !description || !status) {
          Swal.showValidationMessage('Please fill in all fields!');
          return false;
        }
        return { name, price: Number(price), description, status };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedProduct: Product = {
          ...product,
          name: result.value.name,
          price: result.value.price,
          description: result.value.description,
          status: result.value.status,
        };
        this.productsService.updateProduct(updatedProduct);
        Swal.fire({
          icon: 'success',
          title: 'Product Updated!',
          text: 'The product has been successfully updated.',
          confirmButtonText: 'Okay',
        });
        this.loadProducts();
      }
    });
  }

  addNewProduct() {
    Swal.fire({
      title: 'Add New Product',
      html: `
      <input id="name" class="swal2-input" placeholder="Product Name">
      <input id="price" class="swal2-input" placeholder="Product Price" type="number">
      <textarea id="description" class="swal2-textarea" placeholder="Product Description"></textarea>
      <input id="imageUrl" class="swal2-input" placeholder="Image URL">
      <input id="status" class="swal2-input" placeholder="Product Status">
      <input id="category" class="swal2-input" placeholder="Product Category">
    `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement)
          .value;
        const price = (document.getElementById('price') as HTMLInputElement)
          .value;
        const description = (
          document.getElementById('description') as HTMLTextAreaElement
        ).value;
        const imageUrl = (
          document.getElementById('imageUrl') as HTMLInputElement
        ).value;
        const status = (document.getElementById('status') as HTMLInputElement)
          .value;
        const category = (
          document.getElementById('category') as HTMLInputElement
        ).value;
        if (
          !name ||
          !price ||
          !description ||
          !imageUrl ||
          !status ||
          !category
        ) {
          Swal.showValidationMessage('Please fill in all fields!');
          return false;
        }
        return {
          name,
          price: Number(price),
          description,
          imageUrl,
          status,
          category,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newProduct: Product = {
          id: Date.now(),
          ...result.value,
        };
        this.productsService.addProduct(newProduct);
        Swal.fire({
          icon: 'success',
          title: 'Product Added!',
          text: 'The new product has been successfully added.',
          confirmButtonText: 'Okay',
        });
        this.loadProducts();
      }
    });
  }
deleteProduct(product: Product): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This product will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.productsService.deleteProduct(product.id); 
      Swal.fire({
        icon: 'success',
        title: 'Product Deleted!',
        text: 'The product has been successfully deleted.',
        confirmButtonText: 'Okay',
      });
      this.loadProducts(); // Reload products to reflect the deletion
    }
  });
}

}
