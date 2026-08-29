import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const TermsAndConditions = () => {
    return (
        <div className="container mx-auto  px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            Terms & Conditions
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                            Please read these terms carefully .
                            
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-8">

                        <section>
                            <h2 className="font-semibold text-lg">
                                1. Introduction
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Welcome to SkyCart. By accessing or using our
                                website and services, you agree to comply with
                                these Terms & Conditions. If you do not agree
                                with these terms, please do not use our
                                services.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                2. Use of the Website
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                You agree to use SkyCart only for lawful
                                purposes and in a way that does not interfere
                                with the operation or security of the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                3. User Accounts
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Some features may require an account. You are
                                responsible for providing accurate information
                                and keeping your account credentials secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                4. Products and Prices
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                We try to keep product information, images,
                                prices, and availability accurate. However,
                                errors or changes may occasionally occur.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                5. Orders
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                An order may be cancelled or refused in certain
                                situations, including product unavailability,
                                pricing errors, suspected fraudulent activity,
                                or other legitimate reasons.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                6. Payments
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Payments may be processed through third-party
                                payment providers. Their respective terms and
                                policies may also apply.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                7. Shipping and Delivery
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Delivery times may vary depending on product
                                availability, destination, courier services,
                                and other circumstances.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                8. Returns and Refunds
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Returns, replacements, cancellations, and
                                refunds are subject to the applicable SkyCart
                                policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                9. Intellectual Property
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                The SkyCart name, logo, website design, text,
                                graphics, and other content may not be
                                reproduced or used without appropriate
                                authorization.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                10. Changes to These Terms
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                SkyCart may update these Terms & Conditions from
                                time to time. Updated terms will be published
                                on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                11. Contact Us
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                If you have any questions about these terms,
                                please contact the SkyCart support team.
                            </p>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TermsAndConditions;