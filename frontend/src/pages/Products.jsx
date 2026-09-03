
import { Button } from "@/components/ui/button";
import { ProductData } from "@/context/ProductContext";
import React, { useState } from "react";
import { Input } from "@base-ui/react";
import { FilterIcon, X, Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Products = () => {
  const [show, setShow] = useState(false);

  const {
    search,
    setSearch,
    categories,
    category,
    setCategory,
    totalpages,
    price,
    setPrice,
    page,
    setPage,
    products,
    loading,
  } = ProductData();

  const clearFilter = () => {
    setPage("");
    setCategory("");
    setSearch("");
    setPage(1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <aside
          className={` 
            fixed inset-y-0 left-0 z-50 md:z-40  w-72.5 bg-green-50 dark:bg-slate-900
            border-r border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${show ? "translate-x-0" : "-translate-x-full"} 
            md:sticky md:top-0  md:h-screen md:self-start
            md:translate-x-0   md:z-20  md:shadow-none `}>
    

          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white shadow-sm">
                <SlidersHorizontal size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Filters
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Refine your products
                </p>
              </div>
            </div>

            {/* Mobile Close */}
            <button
              onClick={() => setShow(false)}
              className=" md:hidden flex h-9 w-9 items-center justify-center  rounded-full
                        bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                          hover:bg-slate-200 dark:hover:bg-slate-700 transition ">

              <X size={18} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-6 space-y-7 overflow-y-auto h-[calc(100vh-81px)]">

            {/* Search */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Search Products
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="
                    absolute left-3.5 top-1/2 -translate-y-1/2  text-slate-400 " />

                <Input
                  type="text"
                  placeholder="Search by title..."
                  className=" w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700
                            bg-slate-50 dark:bg-slate-800 pl-10 pr-4  text-sm text-slate-900 dark:text-white
                              placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2
                               focus:ring-blue-500/20 transition "
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Category
              </label>

              <select
                className=" w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700
                            bg-slate-50 dark:bg-slate-800 px-3.5 text-sm  text-slate-800
                            dark:text-slate-200 outline-none cursor-pointerg focus:border-blue-500
                              focus:ring-2 focus:ring-blue-500/20 transition "
                value={category}
                onChange={(e) => setCategory(e.target.value)} >

                <option value="">All Categories</option>

                {categories.map((e) => {
                  return (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Sort By Price
              </label>

              <select
                className=" w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700
                           bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800
                           dark:text-slate-200 outline-none cursor-pointer focus:border-blue-500
                             focus:ring-2 focus:ring-blue-500/20  transition "
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="">Select Sorting</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-800" />

            {/* Clear Filters */}
            <Button
              onClick={clearFilter}
              variant="outline"
              className="w-full h-11  rounded-xl border-slate-200 dark:border-slate-700
                          bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200
                          hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600
                           dark:hover:text-blue-400 transition ">

              <RotateCcw size={16} className="mr-2" />
              Clear All Filters
            </Button>

          </div>
        </aside>

        {/* ================= MOBILE OVERLAY ================= */}
        {show && (
          <div
            onClick={() => setShow(false)}
            className=" fixed inset-0 z-40 bg-black/40 backdrop-blur-sm  md:hidden " />
        )}

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 min-w-0">

          {/* Top Header */}
          <div
            className=" sticky  md:static top-0 z-30 border-b border-slate-200 dark:border-slate-800
                        bg-white/90 dark:bg-slate-950/90 backdrop-blur-md ">

            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  All Products
                </h1>

                <p className="block text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Discover products you'll love
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShow(true)}
                className="md:hidden flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700
                            dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2.5
                            text-sm font-semibold shadow-sm  transition">

                <FilterIcon size={17} />
                Filters
              </button>

            </div>
          </div>

          {/* Products Area */}
          <div className="p-4 sm:p-6 lg:p-8">

            {loading ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {products && products.length > 0 ? (
                  <div
                    className=" grid grid-cols-2  md:grid-cols-2
                                lg:grid-cols-3 xl:grid-cols-4 gap-5  sm:gap-6 ">

                    {products.map((e) => (
                      <ProductCard
                        key={e._id}
                        product={e}
                        latest="no"
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="min-h-[55vh] flex flex-col items-center justify-center text-center
                                   rounded-2xl  border border-dashed border-slate-300
                                    dark:border-slate-700 bg-white dark:bg-slate-900 px-6 ">

                    <div className=" flex h-16 w-16 items-center justify-center rounded-2xl
                                    bg-slate-100 dark:bg-slate-800 text-slate-400
                                     dark:text-slate-500 mb-5 ">

                      <Search size={27} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      No Products Found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      We couldn't find any products matching your current
                      filters. Try changing your search or filters.
                    </p>

                    <Button
                      onClick={clearFilter}
                      variant="outline"
                      className="
                        mt-5
                        rounded-xl
                        border-slate-200 dark:border-slate-700
                      "
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* ================= PAGINATION ================= */}
                <div className="mt-10 flex justify-center">
                  <div className=" rounded-2xl border border-slate-200 dark:border-slate-800
                                  bg-white dark:bg-slate-900 px-3 py-2 shadow-sm ">

                    <Pagination>
                      <PaginationContent>

                        {page !== 1 && (
                          <PaginationItem
                            className="cursor-pointer"
                            onClick={prevPage}
                          >
                            <PaginationPrevious
                              className="
                                rounded-xl  text-slate-600 dark:text-slate-300
                                hover:bg-slate-100 dark:hover:bg-slate-800
                                hover:text-blue-600 dark:hover:text-blue-400
                              "
                            />
                          </PaginationItem>
                        )}

                        {/* Current Page */}
                        <PaginationItem>
                          <div className="flex h-9 min-w-9 items-center justify-center
                                          rounded-xl bg-blue-600 dark:bg-blue-500px-3
                                          text-sm font-semibold text-white shadow-sm">

                            {page}
                          </div>
                        </PaginationItem>

                        {page !== totalpages && (
                          <PaginationItem
                            className="cursor-pointer"
                            onClick={nextPage}
                          >
                            <PaginationNext
                              className="rounded-xl text-slate-600 dark:text-slate                               
                                       hover:bg-slate-100 dark:hover:bg-slate-800
                                       hover:text-blue-600 dark:hover:text-blue-400"/>

                          </PaginationItem>
                        )}

                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>

                {/* Page Information */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Page {page} of {totalpages}
                  </p>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;

