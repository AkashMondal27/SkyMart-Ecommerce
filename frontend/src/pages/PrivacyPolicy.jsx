import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto  px-4  py-10">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            Privacy Policy
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                            Your privacy is important to us.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-8">

                        <section>
                            <h2 className="font-semibold text-lg">
                                1. Introduction
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                This Privacy Policy explains how SkyCart
                                collects, uses, and protects information when
                                you use our website and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                2. Information We Collect
                            </h2>

                            <p className="text-muted-foreground mt-2">
                                Depending on how you use SkyCart, we may collect:
                            </p>

                            <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                                <li>Name and contact information</li>
                                <li>Email address</li>
                                <li>Delivery information</li>
                                <li>Account information</li>
                                <li>Order information</li>
                                <li>Information provided when contacting us</li>
                                <li>Technical information about your device</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                3. How We Use Your Information
                            </h2>

                            <p className="text-muted-foreground mt-2">
                                We may use your information to:
                            </p>

                            <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                                <li>Manage your account</li>
                                <li>Process and deliver orders</li>
                                <li>Process payments</li>
                                <li>Provide customer support</li>
                                <li>Improve our website and services</li>
                                <li>Communicate about your orders</li>
                                <li>Prevent fraud and misuse</li>
                                <li>Comply with applicable laws</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                4. Payment Information
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Payments may be handled by third-party payment
                                providers. Payment providers may process your
                                payment information according to their own
                                privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                5. Cookies
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                SkyCart may use cookies or similar technologies
                                to maintain sessions, remember preferences,
                                improve functionality, and understand website
                                usage.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                6. Sharing Information
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                We may share necessary information with trusted
                                service providers such as payment processors,
                                delivery partners, hosting providers, and
                                technical service providers.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                7. Data Security
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                We take reasonable measures to protect your
                                information from unauthorized access, misuse,
                                alteration, or disclosure. However, no
                                internet-based system can be guaranteed to be
                                completely secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                8. Data Retention
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Information may be retained as reasonably
                                necessary to provide our services, maintain
                                records, resolve disputes, prevent fraud, and
                                comply with applicable legal obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                9. Your Rights
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Depending on applicable law, you may have rights
                                relating to your personal information,
                                including requesting access, correction, or
                                deletion of certain information.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                10. Changes to This Policy
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                SkyCart may update this Privacy Policy from
                                time to time. Any updated version will be
                                published on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg">
                                11. Contact Us
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                If you have questions about this Privacy Policy
                                or how your information is handled, please
                                contact the SkyCart support team.
                            </p>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;