"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { myAppHook } from '@/context/AppProvider'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from "react-hot-toast"
import Swal from 'sweetalert2'

interface ProductType {
    id?: number;
    name: string;
    description?: string;
    price?: number;
    file?: File | null
    banner_image?: string | "";
}

const Dashboard: React.FC = () => {

    const router = useRouter()
    const { authToken, isLoading } = myAppHook()

    //fetch products
    const [products, setProducts] = React.useState<ProductType[]>([])

    //product edit
    const [isEdit, setIsEdit] = React.useState<boolean>(false)

    //file upload
    const fileRef = React.useRef<HTMLInputElement>(null)

    const [formData , setFormData] = React.useState<ProductType>({
        name: "",
        description: "",
        price: 0,
        file: null,
        banner_image: ""
    })  

    useEffect(() => {
        if (!authToken) {
            router.push("/auth")
            return;
        }
        fetchProducts()
    }, [authToken, router])



    const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {

        if(event.target.files) {
            //file upload
            setFormData({
                ...formData,
                file: event.target.files[0],
                banner_image: URL.createObjectURL(event.target.files[0])
            })
        }else{
            //no file upload
            setFormData({
                ...formData,
                [event.target.name] : event.target.value
            } )

        } 
    }

    //submit form
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('price', formData.price.toString());
        
        if(formData.file) {
            formDataToSend.append('banner_image', formData.file);
        }

        // Debug the final FormData
        console.log('Final FormData:', Array.from(formDataToSend.entries()));

        try {
           if(isEdit){
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`
                }
            })

            if(response.data.status) {
                toast.success(response.data.message)
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    file: null,
                    banner_image: ""
                })
                if (fileRef.current) {
                    fileRef.current.value = "";
                }
                fetchProducts(); //refresh the product list
            }

           }else{
            //add product
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`
                }
            })
            
            if(response.data.status) {
                toast.success(response.data.message)
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    file: null,
                    banner_image: ""
                })
                if (fileRef.current) {
                    fileRef.current.value = "";
                }
                fetchProducts(); //refresh the product list
            }
           }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "Failed to save product");
                console.log("Validation errors:", error.response.data.errors);
            } else {
                toast.error("An error occurred");
            }
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            setProducts(response.data.products)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch products")
        }
    }

  return (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4">
                    <h4>{ isEdit ? "Edit" : "Add"} Product</h4>
                    <form onSubmit={ handleSubmit}>
                        <input 
                            className="form-control mb-2" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChangeEvent}
                            placeholder="Title" 
                            required />
                        <input 
                            className="form-control mb-2" 
                            name="description" 
                            value={formData.description}
                            onChange={handleChangeEvent}
                            placeholder="Description" 
                            required />
                        <input 
                            className="form-control mb-2"
                            name="price" 
                            value={formData.price}
                            onChange={handleChangeEvent}
                            placeholder="Cost" 
                            type="number" 
                            required />
                        <div className="mb-2">
                            {formData.banner_image && (
                                <Image 
                                src={formData.banner_image} 
                                alt="Preview"  
                                id="bannerPreview" 
                                width={100} 
                                height={100} 
                                 />
                             ) 
                            
                            }     
                        </div>
                        <input 
                            className="form-control mb-2" 
                            type="file" 
                            ref={fileRef}
                            name="banner_image"
                            onChange={handleChangeEvent}
                            id="bannerInput" />
                        <button className="btn btn-primary" type="submit">{isEdit ? "Update" : "Create"} Product</button>
                    </form>
                </div>
            </div>

            <div className="col-md-6">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Banner</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                    {
                                        product.banner_image ? (
                                            <Image
                                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/products/${product.banner_image}`}
                                            alt={product.name}
                                            width={50}
                                            height={50}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )
                                    }
                                    </td>
                                    <td>${product.price}</td>
                                    <td>
                                        <button 
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            setFormData({
                                                id: product.id,
                                                name: product.name,
                                                description: product.description,
                                                price: product.price,
                                                file: null,
                                                banner_image: product.banner_image
                                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/products/${product.banner_image}` : ""
                                            })

                                            setIsEdit(true)
                                        }}
                                        >
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                       
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Dashboard