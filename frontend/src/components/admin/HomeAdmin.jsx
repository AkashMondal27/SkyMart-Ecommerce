import { ProductData } from '@/context/ProductContext'
import React, { useState } from 'react'
import Loading from '../Loading'
import ProductCard from '../ProductCard'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { categories } from './ProductCategories'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { server } from '@/main'


const HomeAdmin = () => {
  const {
    loading,
    products,
    page,
    setPage,
    fetchProducts,
    totalPages,
  } = ProductData()

  // =========================
  // ADD PRODUCT STATE
  // =========================

  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    images: [],
  })


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  // =========================
  // IMAGE CHANGE
  // =========================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (selectedFiles.length === 0) {
      return
    }

    if (selectedFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      e.target.value = ''
      return
    }

    setFormData((prev) => ({
      ...prev,
      images: selectedFiles,
    }))
  }


  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      images: [],
    })
  }


  // =========================
  // CLOSE DIALOG
  // =========================

  const handleDialogChange = (value) => {
    setOpen(value)

    if (!value && !submitting) {
      resetForm()
    }
  }


  // =========================
  // SUBMIT PRODUCT
  // =========================

 const submitHandler = async (e) => {
  e.preventDefault()

  const title = formData.title.trim()
  const description = formData.description.trim()
  const price = Number(formData.price)
  const stock = Number(formData.stock)

  // ---------------- VALIDATION ----------------

  if (!title) {
    toast.error('Please enter product title')
    return
  }

  if (!description) {
    toast.error('Please enter product description')
    return
  }

  if (!formData.category) {
    toast.error('Please select a category')
    return
  }

  if (!Number.isFinite(price) || price <= 0) {
    toast.error('Please enter a valid price')
    return
  }

  if (!Number.isInteger(stock) || stock < 0) {
    toast.error('Please enter a valid stock quantity')
    return
  }

  if (!formData.images || formData.images.length === 0) {
    toast.error('Please select at least one image')
    return
  }

  if (formData.images.length > 5) {
    toast.error('Maximum 5 images allowed')
    return
  }

  // ---------------- FORMDATA ----------------

  const form = new FormData()

  form.append('title', title)
  form.append('description', description)
  form.append('category', formData.category)
  form.append('price', String(price))
  form.append('stock', String(stock))

  // IMPORTANT:
  // Backend Multer expects "files"
  formData.images.forEach((image) => {
    form.append('files', image)
  })

  try {
    setSubmitting(true)

    const { data } = await axios.post(
      `${server}/api/v1/products/new`,
      form,
      {
        headers: {
          token: Cookies.get('token'),
        },
      }
    )

    toast.success(
      data?.message || 'Product created successfully'
    )

    // Clear form
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      images: [],
    })

    // Close dialog
    setOpen(false)

    // Refresh products
    await fetchProducts()

  } catch (error) {
    console.error('Create product error:', error)

    toast.error(
      error?.response?.data?.message ||
      'Failed to create product'
    )

  } finally {
    setSubmitting(false)
  }
}


  // =========================
  // PAGINATION
  // =========================

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }


  // =========================
  // UI
  // =========================

  return (
    <div className="w-full">

      {/* ================= HEADER ================= */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Products
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your products and inventory
          </p>
        </div>


        {/* ADD PRODUCT BUTTON */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            inline-flex w-full items-center justify-center gap-2
            rounded-xl bg-blue-600 px-5 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition-all duration-200
            hover:bg-blue-700 hover:shadow-md
            focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2
            dark:bg-blue-500
            dark:hover:bg-blue-600
            dark:focus:ring-offset-slate-950
            sm:w-auto
          "
        >
          <span className="text-xl leading-none">+</span>
          Add Product
        </button>


        {/* ================= ADD PRODUCT DIALOG ================= */}

        <Dialog
          open={open}
          onOpenChange={handleDialogChange}
        >
          <DialogContent
            className="
              w-[calc(100%-1.5rem)]
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              border border-slate-200
              bg-white
              p-0
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-950

              sm:w-full
            "
          >

            {/* DIALOG HEADER */}

            <DialogHeader
              className="
                border-b border-slate-200
                px-5 py-4
                dark:border-slate-800
                sm:px-6
              "
            >
              <DialogTitle
                className="
                  text-xl font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                Add New Product
              </DialogTitle>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a new product to your store inventory.
              </p>
            </DialogHeader>


            {/* ================= FORM ================= */}

            <form
              onSubmit={submitHandler}
              className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
            >

              {/* PRODUCT TITLE */}

              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Product Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                  "
                />
              </div>


              {/* DESCRIPTION */}

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="
                    w-full resize-none rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                  "
                />
              </div>


              {/* CATEGORY */}

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:focus:border-blue-500
                  "
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      value={category}
                      key={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>


              {/* PRICE + STOCK */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* PRICE */}

                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="
                      text-sm font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-sm font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      ₹
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="
                        w-full rounded-xl
                        border border-slate-300
                        bg-white
                        py-3 pl-9 pr-4
                        text-sm text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2 focus:ring-blue-500/20

                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-white
                        dark:placeholder:text-slate-500
                      "
                    />
                  </div>
                </div>


                {/* STOCK */}

                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="
                      text-sm font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Stock
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter stock quantity"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="
                      w-full rounded-xl
                      border border-slate-300
                      bg-white px-4 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/20

                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                  />
                </div>

              </div>


              {/* ================= IMAGES ================= */}

              <div className="space-y-3">

                <div>
                  <label
                    htmlFor="images"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200">
                
                    Product Images
                  </label>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select up to 5 images. JPG, PNG or WEBP recommended.
                  </p>
                </div>


                {/* FILE INPUT */}

                <label
                  htmlFor="images"
                  className="
                    flex cursor-pointer
                    flex-col items-center justify-center
                    rounded-xl
                    border-2 border-dashed
                    border-slate-300
                    bg-slate-50
                    px-4 py-7
                    text-center
                    transition
                    hover:border-blue-400
                    hover:bg-blue-50/50

                    dark:border-slate-700
                    dark:bg-slate-900/60
                    dark:hover:border-blue-500
                    dark:hover:bg-blue-950/20
                  "
                >
                  <div
                    className="
                      mb-2 flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      bg-blue-100
                      text-xl
                      text-blue-600

                      dark:bg-blue-500/10
                      dark:text-blue-400
                    "
                  >
                    ↑
                  </div>

                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Click to upload images
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Maximum 5 images
                  </p>

                  <input
                    id="images"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>


                {/* IMAGE PREVIEWS */}

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                    {formData.images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="
                          group relative
                          aspect-square
                          overflow-hidden
                          rounded-xl
                          border border-slate-200
                          bg-slate-100

                          dark:border-slate-700
                          dark:bg-slate-900
                        "
                      >

                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />


                        {/* REMOVE BUTTON */}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="
                            absolute right-2 top-2
                            flex h-7 w-7
                            items-center justify-center
                            rounded-full
                            bg-black/70
                            text-sm font-bold
                            text-white
                            opacity-100
                            transition
                            hover:bg-red-600
                          "
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ×
                        </button>


                        {/* IMAGE NUMBER */}

                        <div
                          className="
                            absolute bottom-2 left-2
                            rounded-md
                            bg-black/60
                            px-2 py-1
                            text-[10px]
                            font-medium
                            text-white
                          "
                        >
                          Image {index + 1}
                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>


              {/* ================= ACTIONS ================= */}

              <div
                className="
                  flex flex-col-reverse gap-3
                  border-t border-slate-200
                  pt-5

                  dark:border-slate-800

                  sm:flex-row sm:justify-end
                "
              >

                {/* CANCEL */}

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDialogChange(false)}
                  className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-5 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:hover:bg-slate-800

                    sm:w-auto
                  "
                >
                  Cancel
                </button>


                {/* CREATE */}

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    flex w-full
                    items-center justify-center gap-2
                    rounded-xl
                    bg-blue-600
                    px-6 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:bg-blue-500
                    dark:hover:bg-blue-600

                    sm:w-auto
                  "
                >
                  {submitting ? (
                    <>
                      <span
                        className="
                          h-4 w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </button>

              </div>

            </form>

          </DialogContent>
        </Dialog>

      </div>


      {/* ================= PRODUCTS ================= */}

      {loading ? (
        <Loading />
      ) : (
        <>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  product={product}
                  key={product._id}
                  latest="no"
                />
              ))
            ) : (
              <div className="col-span-full flex min-h-[250px] items-center justify-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No products found
                </p>
              </div>
            )}
          </div>


          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (
            <>
              <div className="mt-10 flex justify-center">
                <div
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white px-3 py-2
                    shadow-sm

                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <Pagination>
                    <PaginationContent>

                      {/* PREVIOUS */}

                      {page !== 1 && (
                        <PaginationItem
                          className="cursor-pointer"
                          onClick={prevPage}
                        >
                          <PaginationPrevious
                            className="
                              rounded-xl
                              text-slate-600
                              hover:bg-slate-100
                              hover:text-blue-600

                              dark:text-slate-300
                              dark:hover:bg-slate-800
                              dark:hover:text-blue-400
                            "
                          />
                        </PaginationItem>
                      )}


                      {/* CURRENT PAGE */}

                      <PaginationItem>
                        <div
                          className="
                            flex h-9 min-w-9
                            items-center justify-center
                            rounded-xl
                            bg-blue-600
                            px-3
                            text-sm font-semibold
                            text-white
                            shadow-sm

                            dark:bg-blue-500
                          "
                        >
                          {page}
                        </div>
                      </PaginationItem>


                      {/* NEXT */}

                      {page !== totalPages && (
                        <PaginationItem
                          className="cursor-pointer"
                          onClick={nextPage}
                        >
                          <PaginationNext
                            className="
                              rounded-xl
                              text-slate-600
                              hover:bg-slate-100
                              hover:text-blue-600

                              dark:text-slate-300
                              dark:hover:bg-slate-800
                              dark:hover:text-blue-400
                            "
                          />
                        </PaginationItem>
                      )}

                    </PaginationContent>
                  </Pagination>
                </div>
              </div>


              {/* PAGE INFO */}

              <div className="mt-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Page {page} of {totalPages}
                </p>
              </div>
            </>
          )}

        </>
      )}

    </div>
  )
}

export default HomeAdmin










// import { ProductData } from '@/context/ProductContext'
// import React, { useState } from 'react'
// import Loading from '../Loading'
// import ProductCard from '../ProductCard'


// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination'

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '../ui/dialog'

// import { categories } from './ProductCategories'
// import toast from 'react-hot-toast'
// import { Button } from '@base-ui/react'
// import axios from 'axios'
// import { server } from '@/main'





// const HomeAdmin = () => {
//   const {
//     loading,
//     products,
//     page,
//     setPage,
//     fetchProduct,
//     fetchProducts,
//     totalPages,
//   } = ProductData()


//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       image: e.target.files[0],
//     }))
//   }


//   const submitHadlar=  async((e)=>{
//     e.preventDefauly()

//     if(!formData.image || formData.image.length ===o){
//       toast.error("Pleaase Select Atleat One image ")
//       return;
//     }


//     const form= new FormData()

//     object.entries(formData).forEach(([key, value])=>{
//       if(key==="image"){
//         for(let i=0; i<value.length; i++){
//           form.append("file",value[i]);
//         }}else{
//           form.append(key, value);
//         }    
//     })

//     try {
//       const{data}=await axios.post(`${server}api/v1/product/new`,form,{
//         headers:{
//           "Content-Type":"multipart/form-data",
//           token:Cookies.get("token")
//         }
//       })

//       toast.success(data.messsage)
      
//     } catch (error) {
//       console.log(error)
//       toast.error(error.response.data.messsage)
//     }
//   })


//   const prevPage = () => {
//     if (page > 1) {
//       setPage(page - 1)
//     }
//   }

//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1)
//     }
//   }

//   const [open, setOpen] = useState(false)

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     price: '',
//     stock: '',
//     image: null,
//   })

//   return (
//     <div className="w-full">
//       {/* ================= HEADER ================= */}
//       <div className="mb-4 pt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//             All Products
//           </h2>

//           <p className=" text-sm text-slate-500 dark:text-slate-400">
//             Manage your products and inventory
//           </p>
//         </div>

//         <button
//           onClick={() => setOpen(true)}
//           className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5
//                      text-sm font-semibold text-white shadow-sm
//                      transition-all duration-200
//                      hover:bg-blue-700 hover:shadow-md
//                      dark:bg-blue-500 dark:hover:bg-blue-600"
//         >
//           <span className="text-lg leading-none">+</span>
//           Add Product
//         </button>


//         {/* ------------Form Open Fter the clicking ADD Products--------------- */}

//           <Dialog open={open} onOpenChange={setOpen}>
            

//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle> Add New Product</DialogTitle>
//               </DialogHeader>

//               <form onSubmit={submitHadlar}  className='space-y-4'>
//                 <input name='title' placeholder='product title' value={formData.title}
//                        onChange={handleChange} required />

//                  <input name='description' placeholder='product description' value={formData.description}
//                        onChange={handleChange} required />


//                   <select name="category" placeholder="category" value={formData.category} 
//                           onChange={handleChange} required >

//                      <option value={""}> select Category</option>       
//                           {categories.map((e)=>{
//                             return <option value={e} key={e}>  {e} </option>
//                           })}
//                   </select>
                 

//                   <input name='price' placeholder='product price' value={formData.price}
//                        onChange={handleChange} required />

//                   <input name='stock' placeholder='product stock' value={formData.stock}
//                        onChange={handleChange} required />  


//               <input type='file' multiple name='image' accept='image/*'
//                 onChange={(e) => {
//                   if (e.target.files.length > 5) {
//                     toast.error("Maximum 5 images allowed")
//                     e.target.value = ""
//                     return
//                   }

//                   handleFileChange(e)
//                 }} required />    


//                 <Button type="submit" className="w-full">
//                   create product
//                 </Button>


//               </form>
//             </DialogContent>
//           </Dialog>










//       </div>

//       {/* ================= PRODUCTS ================= */}
//       {loading ? (
//         <Loading />
//       ) : (
//         <>
//           <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//             {products && products.length > 0 ? (
//               products.map((e) => (
//                 <ProductCard
//                   product={e}
//                   key={e._id}
//                   latest={'no'}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full flex min-h-[250px] items-center justify-center">
//                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                   No products found
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* ================= PAGINATION ================= */}
//           {totalPages > 1 && (
//             <>
//               <div className="mt-10 flex justify-center">
//                 <div
//                   className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm
//                              dark:border-slate-800 dark:bg-slate-900"
//                 >
//                   <Pagination>
//                     <PaginationContent>
//                       {/* PREVIOUS */}
//                       {page !== 1 && (
//                         <PaginationItem
//                           className="cursor-pointer"
//                           onClick={prevPage}
//                         >
//                           <PaginationPrevious
//                             className="rounded-xl text-slate-600
//                                        hover:bg-slate-100 hover:text-blue-600
//                                        dark:text-slate-300 dark:hover:bg-slate-800
//                                        dark:hover:text-blue-400"
//                           />
//                         </PaginationItem>
//                       )}

//                       {/* CURRENT PAGE */}
//                       <PaginationItem>
//                         <div
//                           className="flex h-9 min-w-9 items-center justify-center
//                                      rounded-xl bg-blue-600 px-3 text-sm font-semibold
//                                      text-white shadow-sm
//                                      dark:bg-blue-500"
//                         >
//                           {page}
//                         </div>
//                       </PaginationItem>

//                       {/* NEXT */}
//                       {page !== totalPages && (
//                         <PaginationItem
//                           className="cursor-pointer"
//                           onClick={nextPage}
//                         >
//                           <PaginationNext
//                             className="rounded-xl text-slate-600
//                                        hover:bg-slate-100 hover:text-blue-600
//                                        dark:text-slate-300 dark:hover:bg-slate-800
//                                        dark:hover:text-blue-400"
//                           />
//                         </PaginationItem>
//                       )}
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               </div>

//               {/* PAGE INFO */}
//               <div className="mt-3 text-center">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   Page {page} of {totalPages}
//                 </p>
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// export default HomeAdmin








// // import { ProductData } from '@/context/ProductContext'
// // import React, { useState } from 'react'
// // import Loading from '../Loading';
// // import ProductCard from '../ProductCard';
// // import {
// //   Pagination,
// //   PaginationContent,
// //   PaginationItem,
// //   PaginationNext,
// //   PaginationPrevious,
// // } from '@/components/ui/pagination';

// // const HomeAdmin = () => {
// //   const { loading, products, page, setPage, fetchProduct, totalPages } = ProductData();

// //   const prevPage = () => {
// //     if (page > 1) {
// //       setPage(page - 1);
// //     }
// //   };

// //   const nextPage = () => {
// //     if (page < totalPages) {
// //       setPage(page + 1);
// //     }
// //   };


// //   const [open, setOpen] = useState(false);

// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     category: '',
// //     price: '',
// //     stock: '',
// //     image: null,
// //   });

// //   return (
// //     <div>
// //       <div className='flex justify-center mb-6'>
// //         <h2 className='text-2xl font-bold'>All Products</h2>
// //       </div>

// //       <button onClick={() => setOpen(true)} className='mb-4'>
// //         add product
// //       </button>

// //       {loading ? (
// //         <Loading />
// //       ) : (
// //         <>
// //           <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
// //             {products && products.length > 0 ? (
// //               products.map((e) => <ProductCard product={e} key={e._id} latest={'no'} />)
// //             ) : (
// //               <p>No products</p>
// //             )}
// //           </div>

// //           {/* ================= PAGINATION ================= */}
// //           <div className='mt-10 flex justify-center'>
// //             <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm'>
// //               <Pagination>
// //                 <PaginationContent>
// //                   {page !== 1 && (
// //                     <PaginationItem className='cursor-pointer' onClick={prevPage}>
// //                       <PaginationPrevious
// //                         className='rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
// //                       />
// //                     </PaginationItem>
// //                   )}

// //                   <PaginationItem>
// //                     <div className='flex h-9 min-w-9 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm dark:bg-blue-500'>
// //                       {page}
// //                     </div>
// //                   </PaginationItem>

// //                   {page !== totalPages && (
// //                     <PaginationItem className='cursor-pointer' onClick={nextPage}>
// //                       <PaginationNext
// //                         className='rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
// //                       />
// //                     </PaginationItem>
// //                   )}
// //                 </PaginationContent>
// //               </Pagination>
// //             </div>
// //           </div>

// //           <div className='mt-3 text-center'>
// //             <p className='text-xs text-slate-500 dark:text-slate-400'>
// //               Page {page} of {totalPages}
// //             </p>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   )
// // }

// // export default HomeAdmin
