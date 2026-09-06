
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    MapPin,
    Phone,
    User,
    Trash2,
    Plus,
    Check,
    MapPinned,
    Loader2,
    Home,
} from "lucide-react";

const initialAddress = {
    name: "",
    phone: "",
    location: "",
    city: "",
    post: "",
    pinCode: "",
    district: "",
    state: "",
    country: "",
};

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingAddress, setAddingAddress] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState(initialAddress);

    const token = Cookies.get("token");

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/address/all`, {
                headers: { token },
            });

            const fetchedAddresses = data?.data || [];
            setAddresses(fetchedAddresses);

            const savedId = localStorage.getItem("selectedAddressId");
            const savedAddress = fetchedAddresses.find((item) => item._id === savedId);

            if (savedAddress) {
                setSelectedAddress(savedAddress);
            } else if (fetchedAddresses.length) {
                setSelectedAddress(fetchedAddresses[0]);
                localStorage.setItem("selectedAddressId", fetchedAddresses[0]._id);
            } else {
                setSelectedAddress(null);
                localStorage.removeItem("selectedAddressId");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        localStorage.setItem("selectedAddressId", address._id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        const requiredFields = ["name", "phone", "location", "city", "post", "pinCode", "state", "country"];

        if (requiredFields.some((field) => !newAddress[field]?.trim())) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setAddingAddress(true);

            const { data } = await axios.post(
                `${server}/api/v1/address/new`,
                { address: newAddress },
                { headers: { token } }
            );

            const createdAddress = data?.data;
            if (!createdAddress) throw new Error("Address was not created");

            setAddresses((prev) => [createdAddress, ...prev]);
            setSelectedAddress(createdAddress);
            localStorage.setItem("selectedAddressId", createdAddress._id);

            setNewAddress(initialAddress);
            setIsModalOpen(false);
            toast.success(data?.message || "Address added successfully");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to add address");
        } finally {
            setAddingAddress(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            setDeletingId(id);

            await axios.delete(`${server}/api/v1/address/${id}`, {
                headers: { token },
            });

            const remaining = addresses.filter((address) => address._id !== id);
            setAddresses(remaining);

            if (selectedAddress?._id === id) {
                const nextAddress = remaining[0] || null;
                setSelectedAddress(nextAddress);

                if (nextAddress) localStorage.setItem("selectedAddressId", nextAddress._id);
                else localStorage.removeItem("selectedAddressId");
            }

            toast.success("Address deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] bg-background">
            <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPinned className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Choose a delivery address for your order
                    </p>
                </div>

                <section>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Delivery Address</h2>
                            <p className="text-sm text-muted-foreground">
                                {addresses.length
                                    ? `${addresses.length} saved ${addresses.length === 1 ? "address" : "addresses"}`
                                    : "No saved addresses"}
                            </p>
                        </div>

                        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Address
                        </Button>
                    </div>

                    {addresses.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center py-12 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                    <Home className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No saved addresses</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Add a delivery address to continue.
                                </p>
                                <Button onClick={() => setIsModalOpen(true)} className="mt-5">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Address
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {addresses.map((item) => {
                                const details = item.address;
                                const isSelected = selectedAddress?._id === item._id;

                                return (
                                    <Card
                                        key={item._id}
                                        onClick={() => handleSelectAddress(item)}
                                        className={`relative cursor-pointer transition ${
                                            isSelected
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "hover:border-primary/50"
                                        }`}
                                    >
                                        {isSelected && (
                                            <Badge className="absolute right-4 top-4 gap-1">
                                                <Check className="h-3 w-3" />
                                                Selected
                                            </Badge>
                                        )}

                                        <CardHeader className="pr-24">
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="truncate">{details?.name}</span>
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                                <div className="space-y-1">
                                                    <p>{details?.location}</p>
                                                    <p>
                                                        {details?.city}
                                                        {details?.post && `, ${details.post}`}
                                                    </p>
                                                    <p>
                                                        {details?.district && `${details.district}, `}
                                                        {details?.state && `${details.state}, `}
                                                        {details?.country}
                                                    </p>
                                                    <p className="font-medium">PIN: {details?.pinCode}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {details?.phone}
                                            </div>

                                            <div
                                                className="flex gap-2 pt-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    variant={isSelected ? "secondary" : "outline"}
                                                    className="flex-1"
                                                    onClick={() => handleSelectAddress(item)}
                                                >
                                                    {isSelected ? "Selected" : "Use This Address"}
                                                </Button>

                                                {isSelected && (
                                                    <Button asChild size="lg" className="flex-1">
                                                        <Link to={`/payment/${selectedAddress._id}`}>
                                                            Continue to Payment
                                                        </Link>
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={deletingId === item._id}
                                                    onClick={() => handleDeleteAddress(item._id)}
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    {deletingId === item._id ? (
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
                </section>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>Enter your delivery details.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="Enter full name" value={newAddress.name} onChange={handleInputChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="Enter phone number" value={newAddress.phone} onChange={handleInputChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Nearby Location / Area</Label>
                                <Input id="location" name="location" placeholder="House, road, area..." value={newAddress.location} onChange={handleInputChange} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City / Village</Label>
                                    <Input id="city" name="city" placeholder="City or village" value={newAddress.city} onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="post">Post Office</Label>
                                    <Input id="post" name="post" placeholder="Post office" value={newAddress.post} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Input id="district" name="district" placeholder="District" value={newAddress.district} onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" name="state" placeholder="State" value={newAddress.state} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" name="country" placeholder="Country" value={newAddress.country} onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pinCode">PIN / ZIP Code</Label>
                                    <Input id="pinCode" name="pinCode" placeholder="Enter PIN code" value={newAddress.pinCode} onChange={handleInputChange} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={addingAddress}>
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={addingAddress}>
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

