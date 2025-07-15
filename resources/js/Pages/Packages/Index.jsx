import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Package, Check, Star, Users, Clock, Utensils, Music, Camera, Flower, Wine, Gift, ChevronRight, Heart, Info } from 'lucide-react';

const packages = [
    {
        id: 1,
        name: 'Essential Package',
        price: 299,
        originalPrice: 399,
        description: 'Perfect for intimate gatherings and small celebrations',
        popular: false,
        guestRange: '10-25 guests',
        duration: '4 hours',
        image: '/placeholder.svg?height=300&width=400',
        features: [
            'Private dining area',
            'Basic table setup',
            'Standard menu selection',
            'Soft drinks included',
            'Basic sound system',
            'Event coordinator',
            'Clean-up service'
        ],
        addOns: [
            { name: 'Photography', price: 150 },
            { name: 'Floral arrangements', price: 100 },
            { name: 'Live music', price: 200 }
        ],
        color: 'blue'
    },
    {
        id: 2,
        name: 'Premium Package',
        price: 599,
        originalPrice: 799,
        description: 'Great for medium-sized events with enhanced amenities',
        popular: true,
        guestRange: '25-60 guests',
        duration: '6 hours',
        image: '/placeholder.svg?height=300&width=400',
        features: [
            'Premium venue space',
            'Elegant table settings',
            'Extended menu options',
            'Premium bar service',
            'Professional DJ setup',
            'Dedicated event manager',
            'Photography session (2 hours)',
            'Floral centerpieces',
            'Welcome cocktail hour',
            'Custom lighting'
        ],
        addOns: [
            { name: 'Extended photography', price: 200 },
            { name: 'Live band', price: 400 },
            { name: 'Premium florals', price: 250 }
        ],
        color: 'amber'
    },
    {
        id: 3,
        name: 'Luxury Package',
        price: 999,
        originalPrice: 1299,
        description: 'Full-service luxury experience for unforgettable events',
        popular: false,
        guestRange: '60-120 guests',
        duration: '8 hours',
        image: '/placeholder.svg?height=300&width=400',
        features: [
            'Exclusive venue access',
            'Luxury table settings',
            'Gourmet menu selection',
            'Premium open bar',
            'Live entertainment setup',
            'Personal event concierge',
            'Professional photography (4 hours)',
            'Premium floral designs',
            'Welcome reception',
            'Custom décor & lighting',
            'Valet parking service',
            'Gift bags for guests',
            'Late-night snack service'
        ],
        addOns: [
            { name: 'Videography', price: 500 },
            { name: 'Live band upgrade', price: 600 },
            { name: 'Luxury transportation', price: 300 }
        ],
        color: 'purple'
    },
    {
        id: 4,
        name: 'Custom Package',
        price: 0,
        originalPrice: null,
        description: 'Tailored specifically to your unique vision and requirements',
        popular: false,
        guestRange: 'Any size',
        duration: 'Flexible',
        image: '/placeholder.svg?height=300&width=400',
        features: [
            'Personalized consultation',
            'Custom venue selection',
            'Bespoke menu creation',
            'Tailored service options',
            'Flexible timing',
            'Dedicated planning team',
            'Unlimited revisions',
            'Premium vendor network',
            'Custom décor design',
            'Personalized experience'
        ],
        addOns: [],
        color: 'slate'
    }
];

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        event: 'Wedding Reception',
        package: 'Luxury Package',
        rating: 5,
        comment: 'Absolutely perfect! Every detail was handled beautifully. Our guests are still talking about how amazing everything was.',
        image: '/placeholder.svg?height=60&width=60'
    },
    {
        id: 2,
        name: 'Michael Chen',
        event: 'Corporate Event',
        package: 'Premium Package',
        rating: 5,
        comment: 'Professional service and excellent value. The team made our company celebration memorable and stress-free.',
        image: '/placeholder.svg?height=60&width=60'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        event: 'Birthday Party',
        package: 'Essential Package',
        rating: 5,
        comment: 'Perfect for our intimate celebration. Great quality at an affordable price. Highly recommend!',
        image: '/placeholder.svg?height=60&width=60'
    }
];

export default function Packages() {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const getColorClasses = (color, type = 'bg') => {
        const colors = {
            blue: {
                bg: 'bg-blue-500',
                text: 'text-blue-600',
                border: 'border-blue-200',
                bgLight: 'bg-blue-50'
            },
            amber: {
                bg: 'bg-amber-500',
                text: 'text-amber-600',
                border: 'border-amber-200',
                bgLight: 'bg-amber-50'
            },
            purple: {
                bg: 'bg-purple-500',
                text: 'text-purple-600',
                border: 'border-purple-200',
                bgLight: 'bg-purple-50'
            },
            slate: {
                bg: 'bg-slate-500',
                text: 'text-slate-600',
                border: 'border-slate-200',
                bgLight: 'bg-slate-50'
            }
        };
        return colors[color]?.[type] || colors.amber[type];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold leading-tight text-slate-800">
                            Event Packages
                        </h2>
                        <p className="text-slate-600 mt-1">Choose the perfect package for your special event</p>
                    </div>
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                    >
                        {showComparison ? 'Hide' : 'Compare'} Packages
                    </button>
                </div>
            }
        >
            <Head title="Packages" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-bold mb-4">
                                Make Your Event Extraordinary
                            </h1>
                            <p className="text-xl text-amber-100 mb-6">
                                From intimate gatherings to grand celebrations, we have the perfect package to bring your vision to life.
                            </p>
                            <div className="flex items-center space-x-6 text-amber-100">
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Professional Planning</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Premium Venues</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Full-Service Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Comparison Table */}
                    {showComparison && (
                        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-8 overflow-x-auto">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Package Comparison</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-800">Features</th>
                                        {packages.slice(0, 3).map((pkg) => (
                                            <th key={pkg.id} className="text-center py-3 px-4 font-semibold text-slate-800">
                                                {pkg.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-3 px-4 font-medium">Guest Capacity</td>
                                        {packages.slice(0, 3).map((pkg) => (
                                            <td key={pkg.id} className="text-center py-3 px-4">{pkg.guestRange}</td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-3 px-4 font-medium">Duration</td>
                                        {packages.slice(0, 3).map((pkg) => (
                                            <td key={pkg.id} className="text-center py-3 px-4">{pkg.duration}</td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-3 px-4 font-medium">Photography</td>
                                        <td className="text-center py-3 px-4">Add-on</td>
                                        <td className="text-center py-3 px-4">✓ 2 hours</td>
                                        <td className="text-center py-3 px-4">✓ 4 hours</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-3 px-4 font-medium">Bar Service</td>
                                        <td className="text-center py-3 px-4">Soft drinks</td>
                                        <td className="text-center py-3 px-4">✓ Premium</td>
                                        <td className="text-center py-3 px-4">✓ Open bar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                                    pkg.popular ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Package Image */}
                                    <div className="relative mb-4 rounded-xl overflow-hidden">
                                        <img
                                            src={pkg.image || "/placeholder.svg"}
                                            alt={pkg.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                                                <Heart className="w-4 h-4 text-slate-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Package Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Package className={`w-5 h-5 ${getColorClasses(pkg.color, 'text')}`} />
                                            <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm mb-3">{pkg.description}</p>
                                        
                                        <div className="flex items-baseline space-x-2 mb-3">
                                            {pkg.price > 0 ? (
                                                <>
                                                    <span className="text-3xl font-bold text-slate-800">${pkg.price}</span>
                                                    {pkg.originalPrice && (
                                                        <span className="text-lg text-slate-400 line-through">${pkg.originalPrice}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-2xl font-bold text-slate-800">Custom Quote</span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{pkg.guestRange}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{pkg.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-slate-800 mb-3">What's Included:</h4>
                                        <ul className="space-y-2">
                                            {pkg.features.slice(0, 5).map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2 text-sm">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-slate-600">{feature}</span>
                                                </li>
                                            ))}
                                            {pkg.features.length > 5 && (
                                                <li className="text-sm text-slate-500">
                                                    +{pkg.features.length - 5} more features
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                                                pkg.popular
                                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            {pkg.price > 0 ? 'Select Package' : 'Get Custom Quote'}
                                        </button>
                                        <button className="w-full py-2 px-4 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add-ons Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-12">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Popular Add-ons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                                <Camera className="w-8 h-8 text-amber-600" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">Professional Photography</h4>
                                    <p className="text-sm text-slate-600">Capture every special moment</p>
                                    <p className="text-amber-600 font-semibold">From $150</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                                <Flower className="w-8 h-8 text-amber-600" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">Floral Arrangements</h4>
                                    <p className="text-sm text-slate-600">Beautiful custom florals</p>
                                    <p className="text-amber-600 font-semibold">From $100</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                                <Music className="w-8 h-8 text-amber-600" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">Live Entertainment</h4>
                                    <p className="text-sm text-slate-600">DJ or live band options</p>
                                    <p className="text-amber-600 font-semibold">From $200</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-8 mb-8">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">What Our Clients Say</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <img
                                            src={testimonial.image || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                                            <p className="text-sm text-slate-600">{testimonial.event}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 text-sm italic">"{testimonial.comment}"</p>
                                    <p className="text-xs text-amber-600 font-medium mt-2">{testimonial.package}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 text-center">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                            Ready to Start Planning?
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                            Our event specialists are here to help you choose the perfect package and customize every detail to make your event unforgettable.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold">
                                Book Consultation
                            </button>
                            <button className="px-8 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors font-semibold">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Details Modal */}
            {selectedPackage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{selectedPackage.name}</h3>
                                <button
                                    onClick={() => setSelectedPackage(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <img
                                    src={selectedPackage.image || "/placeholder.svg"}
                                    alt={selectedPackage.name}
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                                
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">Complete Feature List:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {selectedPackage.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-2 text-sm">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-slate-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedPackage.addOns.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-3">Available Add-ons:</h4>
                                        <div className="space-y-2">
                                            {selectedPackage.addOns.map((addon, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                    <span className="text-slate-700">{addon.name}</span>
                                                    <span className="font-semibold text-amber-600">+${addon.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-4">
                                    <button className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold">
                                        {selectedPackage.price > 0 ? 'Book This Package' : 'Request Custom Quote'}
                                    </button>
                                    <button className="px-6 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}