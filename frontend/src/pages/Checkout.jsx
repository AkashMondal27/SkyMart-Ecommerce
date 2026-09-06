import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loading from "@/components/Loading";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Dialog,DialogContent,DialogDescription, DialogFooter,DialogHeader,DialogTitle,} from "@/components/ui/dialog";

import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
    
import {MapPin,Phone,User,Trash2, Plus,Check,CreditCard,MapPinned,Loader2,Home,} from "lucide-react";
    
// ============================================================
// Initial form
// ============================================================

const initialAddress = {
    name: "",
    phone: "",
    location: "",
    city: "",
    post: "",
    pinCode: "",
    district: "",
    state: "",
};


// ============================================================
// Checkout
// ============================================================

const Checkout = () => {
    const [address, setAddress] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newAddress, setNewAddress] = useState(initialAddress);

    const [addingAddress, setAddingAddress] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    // ========================================================
    // Fetch all addresses
    // ========================================================

    const fetchAddress = async () => {
        try {
            const { data } = await axios.get(
                `${server}/api/v1/address/all`,
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );

            const addresses = data?.data || [];

            setAddress(addresses);

            // ------------------------------------------------
            // Restore previously selected address
            // ------------------------------------------------

            const savedAddressId = localStorage.getItem(
                "selectedAddressId"
            );

            if (savedAddressId) {
                const savedAddress = addresses.find(
                    (item) => item._id === savedAddressId
                );

                if (savedAddress) {
                    setSelectedAddress(savedAddress);
                    return;
                }
            }

            // ------------------------------------------------
            // If saved address doesn't exist anymore,
            // select the first address
            // ------------------------------------------------

            if (addresses.length > 0) {
                setSelectedAddress(addresses[0]);

                localStorage.setItem(
                    "selectedAddressId",
                    addresses[0]._id
                );
            } else {
                setSelectedAddress(null);
                localStorage.removeItem("selectedAddressId");
            }
        } catch (error) {
            console.error(
                "Address fetching error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    "Failed to load addresses"
            );
        } finally {
            setLoading(false);
        }
    };


    // ========================================================
    // Select address
    // ========================================================

    const handleSelectAddress = (item) => {
        setSelectedAddress(item);

        localStorage.setItem(
            "selectedAddressId",
            item._id
        );

        toast.success("Delivery address selected");
    };


    // ========================================================
    // Handle form change
    // ========================================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ========================================================
    // Add new address
    // ========================================================

    const handleAddAddress = async (e) => {
        e.preventDefault();

        // -----------------------------------------------
        // Basic validation
        // -----------------------------------------------

        if (
            !newAddress.name.trim() ||
            !newAddress.phone.trim() ||
            !newAddress.location.trim() ||
            !newAddress.city.trim() ||
            !newAddress.post.trim() ||
            !newAddress.pinCode.trim() ||
            !newAddress.state.trim()
        ) {
            toast.error(
                "Please fill all required address fields"
            );

            return;
        }

        try {
            setAddingAddress(true);

            const { data } = await axios.post(
                `${server}/api/v1/address/new`,
                {
                    address: newAddress,
                },
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );

            const createdAddress = data?.data;

            if (!createdAddress) {
                throw new Error(
                    "Address was not returned by server"
                );
            }

            toast.success(
                data?.message ||
                    "Address added successfully"
            );

            // -----------------------------------------------
            // Add new address to current state
            // -----------------------------------------------

            setAddress((prev) => [
                ...prev,
                createdAddress,
            ]);

            // -----------------------------------------------
            // Automatically select new address
            // -----------------------------------------------

            setSelectedAddress(createdAddress);

            localStorage.setItem(
                "selectedAddressId",
                createdAddress._id
            );

            // -----------------------------------------------
            // Reset form
            // -----------------------------------------------

            setNewAddress(initialAddress);

            setIsModalOpen(false);
        } catch (error) {
            console.error(
                "Add address error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    "Failed to add address"
            );
        } finally {
            setAddingAddress(false);
        }
    };


    // ========================================================
    // Delete address
    // ========================================================

    const handleDeleteAddress = async (id) => {
        try {
            setDeletingId(id);

            await axios.delete(
                `${server}/api/v1/address/${id}`,
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );

            toast.success(
                "Address deleted successfully"
            );

            // -----------------------------------------------
            // Remove from UI
            // -----------------------------------------------

            const remainingAddresses =
                address.filter(
                    (item) => item._id !== id
                );

            setAddress(remainingAddresses);

            // -----------------------------------------------
            // If deleted address was selected
            // -----------------------------------------------

            if (selectedAddress?._id === id) {
                if (remainingAddresses.length > 0) {
                    const nextAddress =
                        remainingAddresses[0];

                    setSelectedAddress(nextAddress);

                    localStorage.setItem(
                        "selectedAddressId",
                        nextAddress._id
                    );
                } else {
                    setSelectedAddress(null);

                    localStorage.removeItem(
                        "selectedAddressId"
                    );
                }
            }
        } catch (error) {
            console.error(
                "Delete address error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    "Failed to delete address"
            );
        } finally {
            setDeletingId(null);
        }
    };


    // ========================================================
    // Fetch addresses on page load
    // ========================================================

    useEffect(() => {
        fetchAddress();
    }, []);


    // ========================================================
    // Loading
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="min-h-[60vh] bg-background">
            <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPinned className="h-6 w-6 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                        Choose where you want your order delivered
                    </p>
                </div>


                {/* ==================================================
                    MAIN CONTENT
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

                    {/* ==================================================
                        LEFT SIDE - ADDRESSES
                    ================================================== */}

                    <div>

                        {/* ------------------------------------------
                            ADDRESS HEADER
                        ------------------------------------------ */}

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Delivery Address
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {address.length > 0
                                        ? `${address.length} saved ${
                                              address.length === 1
                                                  ? "address"
                                                  : "addresses"
                                          }`
                                        : "No saved addresses"}
                                </p>
                            </div>

                            <Button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Address
                            </Button>
                        </div>


                        {/* ==================================================
                            EMPTY STATE
                        ================================================== */}

                        {address.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                        <Home className="h-7 w-7 text-muted-foreground" />
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        No saved addresses
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Add a delivery address to continue
                                        with your order.
                                    </p>

                                    <Button
                                        onClick={() =>
                                            setIsModalOpen(true)
                                        }
                                        className="mt-5"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Address
                                    </Button>

                                </CardContent>
                            </Card>
                        ) : (

                            /* ==================================================
                               ADDRESS GRID
                            ================================================== */

                            <div className="grid gap-4 sm:grid-cols-2">

                                {address.map((item) => {
                                    const isSelected =
                                        selectedAddress?._id ===
                                        item._id;

                                    const details =
                                        item.address;

                                    return (
                                        <Card
                                            key={item._id}
                                            className={`relative cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "hover:border-primary/50 hover:shadow-md"
                                            }`}
                                            onClick={() =>
                                                handleSelectAddress(
                                                    item
                                                )
                                            }
                                        >

                                            {/* --------------------------------
                                                SELECTED BADGE
                                            -------------------------------- */}

                                            {isSelected && (
                                                <Badge className="absolute right-4 top-4 gap-1">
                                                    <Check className="h-3 w-3" />
                                                    Selected
                                                </Badge>
                                            )}


                                            {/* --------------------------------
                                                CARD HEADER
                                            -------------------------------- */}

                                            <CardHeader className="pb-3 pr-24">

                                                <CardTitle className="flex items-center gap-2 text-base">

                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>

                                                    <span className="truncate">
                                                        {details?.name}
                                                    </span>

                                                </CardTitle>

                                            </CardHeader>


                                            {/* --------------------------------
                                                CARD CONTENT
                                            -------------------------------- */}

                                            <CardContent className="space-y-3">

                                                {/* Location */}

                                                <div className="flex items-start gap-2 text-sm">

                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                                    <div className="space-y-1">

                                                        <p>
                                                            {details?.location}
                                                        </p>

                                                        <p>
                                                            {details?.city}
                                                            {details?.post &&
                                                                `, ${details.post}`}
                                                        </p>

                                                        <p>
                                                            {details?.district &&
                                                                `${details.district}, `}
                                                            {details?.state}
                                                        </p>

                                                        <p className="font-medium">
                                                            PIN:{" "}
                                                            {
                                                                details?.pinCode
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Phone */}

                                                <div className="flex items-center gap-2 text-sm">

                                                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

                                                    <span>
                                                        {details?.phone}
                                                    </span>

                                                </div>


                                                {/* Actions */}

                                                <div
                                                    className="flex gap-2 pt-2"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >

                                                    <Button
                                                        variant={
                                                            isSelected
                                                                ? "secondary"
                                                                : "outline"
                                                        }
                                                        className="flex-1"
                                                        onClick={() =>
                                                            handleSelectAddress(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        {isSelected ? (
                                                            <>
                                                                <Check className="mr-2 h-4 w-4" />
                                                                Selected
                                                            </>
                                                        ) : (
                                                            "Use This Address"
                                                        )}
                                                    </Button>


                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        disabled={
                                                            deletingId ===
                                                            item._id
                                                        }
                                                        onClick={() =>
                                                            handleDeleteAddress(
                                                                item._id
                                                            )
                                                        }
                                                    >

                                                        {deletingId ===
                                                        item._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}

                                                    </Button>

                                                </div>

                                            </CardContent>
                                        </Card>
                                    );
                                })}

                            </div>
                        )}
                    </div>


                    {/* ==================================================
                        RIGHT SIDE - ORDER / SELECTED ADDRESS
                    ================================================== */}

                    <div className="lg:sticky lg:top-24 lg:h-fit">

                        <Card>

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Delivery Details
                                </CardTitle>
                            </CardHeader>


                            <CardContent>

                                {selectedAddress ? (
                                    <div className="space-y-4">

                                        {/* Selected badge */}

                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <Check className="h-3 w-3" />
                                            Delivery Address Selected
                                        </Badge>


                                        {/* Address */}

                                        <div className="rounded-lg border bg-muted/30 p-4">

                                            <p className="font-semibold">
                                                {
                                                    selectedAddress
                                                        .address?.name
                                                }
                                            </p>

                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {
                                                    selectedAddress
                                                        .address?.location
                                                }
                                                ,{" "}
                                                {
                                                    selectedAddress
                                                        .address?.city
                                                }
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    selectedAddress
                                                        .address?.post
                                                }
                                                ,{" "}
                                                {
                                                    selectedAddress
                                                        .address
                                                        ?.district
                                                }
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    selectedAddress
                                                        .address
                                                        ?.state
                                                }{" "}
                                                -{" "}
                                                {
                                                    selectedAddress
                                                        .address
                                                        ?.pinCode
                                                }
                                            </p>

                                            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                                                <Phone className="h-4 w-4" />
                                                {
                                                    selectedAddress
                                                        .address
                                                        ?.phone
                                                }
                                            </p>

                                        </div>


                                        {/* Continue */}

                                        <Link
                                            to={`/payment/${selectedAddress._id}`}
                                            className="block"
                                        >
                                            <Button
                                                className="w-full"
                                                size="lg"
                                            >
                                                Continue to Payment
                                            </Button>
                                        </Link>


                                        <p className="text-center text-xs text-muted-foreground">
                                            Your selected address will be
                                            remembered for your next checkout.
                                        </p>

                                    </div>
                                ) : (

                                    <div className="py-6 text-center">

                                        <MapPin className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                                        <p className="font-medium">
                                            Select a delivery address
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Choose an address before continuing
                                            to payment.
                                        </p>

                                    </div>
                                )}

                            </CardContent>
                        </Card>

                    </div>

                </div>


                {/* ==================================================
                    ADD ADDRESS DIALOG
                ================================================== */}

                <Dialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                >

                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">

                        <DialogHeader>

                            <DialogTitle>
                                Add New Address
                            </DialogTitle>

                            <DialogDescription>
                                Enter your delivery details below.
                            </DialogDescription>

                        </DialogHeader>


                        <form
                            onSubmit={handleAddAddress}
                            className="space-y-4"
                        >

                            {/* Name */}

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Full Name
                                </Label>

                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={newAddress.name}
                                    onChange={handleInputChange}
                                />
                            </div>


                            {/* Phone */}

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number
                                </Label>

                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={newAddress.phone}
                                    onChange={handleInputChange}
                                />
                            </div>


                            {/* Location */}

                            <div className="space-y-2">
                                <Label htmlFor="location">
                                    Address / Area
                                </Label>

                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="House, road, area..."
                                    value={newAddress.location}
                                    onChange={handleInputChange}
                                />
                            </div>


                            {/* City + Post */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="space-y-2">
                                    <Label htmlFor="city">
                                        City / Village
                                    </Label>

                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="City or village"
                                        value={newAddress.city}
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="post">
                                        Post Office
                                    </Label>

                                    <Input
                                        id="post"
                                        name="post"
                                        placeholder="Post office"
                                        value={newAddress.post}
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>

                            </div>


                            {/* District + State */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="space-y-2">
                                    <Label htmlFor="district">
                                        District
                                    </Label>

                                    <Input
                                        id="district"
                                        name="district"
                                        placeholder="District"
                                        value={newAddress.district}
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="state">
                                        State / Province
                                    </Label>

                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="State or province"
                                        value={newAddress.state}
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>

                            </div>


                            {/* PIN */}

                            <div className="space-y-2">
                                <Label htmlFor="pinCode">
                                    PIN / ZIP Code
                                </Label>

                                <Input
                                    id="pinCode"
                                    name="pinCode"
                                    placeholder="PIN or ZIP code"
                                    value={newAddress.pinCode}
                                    onChange={
                                        handleInputChange
                                    }
                                />
                            </div>


                            {/* Footer */}

                            <DialogFooter className="gap-2 sm:gap-0">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    disabled={addingAddress}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={addingAddress}
                                >

                                    {addingAddress ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Address
                                        </>
                                    )}

                                </Button>

                            </DialogFooter>

                        </form>

                    </DialogContent>

                </Dialog>

            </div>
        </div>
    );
};

export default Checkout;