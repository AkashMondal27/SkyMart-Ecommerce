

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

const HomeAdmin = () => {
  const {
    loading,
    products,
    page,
    setPage,
    fetchProduct,
    totalPages,
  } = ProductData()

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

  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: null,
  })

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-4 pt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            All Products
          </h2>

          <p className=" text-sm text-slate-500 dark:text-slate-400">
            Manage your products and inventory
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5
                     text-sm font-semibold text-white shadow-sm
                     transition-all duration-200
                     hover:bg-blue-700 hover:shadow-md
                     dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span className="text-lg leading-none">+</span>
          Add Product
        </button>
      </div>

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products && products.length > 0 ? (
              products.map((e) => (
                <ProductCard
                  product={e}
                  key={e._id}
                  latest={'no'}
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
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm
                             dark:border-slate-800 dark:bg-slate-900"
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
                            className="rounded-xl text-slate-600
                                       hover:bg-slate-100 hover:text-blue-600
                                       dark:text-slate-300 dark:hover:bg-slate-800
                                       dark:hover:text-blue-400"
                          />
                        </PaginationItem>
                      )}

                      {/* CURRENT PAGE */}
                      <PaginationItem>
                        <div
                          className="flex h-9 min-w-9 items-center justify-center
                                     rounded-xl bg-blue-600 px-3 text-sm font-semibold
                                     text-white shadow-sm
                                     dark:bg-blue-500"
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
                            className="rounded-xl text-slate-600
                                       hover:bg-slate-100 hover:text-blue-600
                                       dark:text-slate-300 dark:hover:bg-slate-800
                                       dark:hover:text-blue-400"
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
// import Loading from '../Loading';
// import ProductCard from '../ProductCard';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';

// const HomeAdmin = () => {
//   const { loading, products, page, setPage, fetchProduct, totalPages } = ProductData();

//   const prevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };


//   const [open, setOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     price: '',
//     stock: '',
//     image: null,
//   });

//   return (
//     <div>
//       <div className='flex justify-center mb-6'>
//         <h2 className='text-2xl font-bold'>All Products</h2>
//       </div>

//       <button onClick={() => setOpen(true)} className='mb-4'>
//         add product
//       </button>

//       {loading ? (
//         <Loading />
//       ) : (
//         <>
//           <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
//             {products && products.length > 0 ? (
//               products.map((e) => <ProductCard product={e} key={e._id} latest={'no'} />)
//             ) : (
//               <p>No products</p>
//             )}
//           </div>

//           {/* ================= PAGINATION ================= */}
//           <div className='mt-10 flex justify-center'>
//             <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm'>
//               <Pagination>
//                 <PaginationContent>
//                   {page !== 1 && (
//                     <PaginationItem className='cursor-pointer' onClick={prevPage}>
//                       <PaginationPrevious
//                         className='rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
//                       />
//                     </PaginationItem>
//                   )}

//                   <PaginationItem>
//                     <div className='flex h-9 min-w-9 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm dark:bg-blue-500'>
//                       {page}
//                     </div>
//                   </PaginationItem>

//                   {page !== totalPages && (
//                     <PaginationItem className='cursor-pointer' onClick={nextPage}>
//                       <PaginationNext
//                         className='rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
//                       />
//                     </PaginationItem>
//                   )}
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           </div>

//           <div className='mt-3 text-center'>
//             <p className='text-xs text-slate-500 dark:text-slate-400'>
//               Page {page} of {totalPages}
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default HomeAdmin
