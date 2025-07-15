import { Head, Link } from '@inertiajs/react';
import { Calendar, Settings, CreditCard, ArrowRight, MapPin, Phone, Users, Clock, Star } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to ReserveEase" />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600"></div>
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full"></div>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-6 py-20 text-center text-white">
                        <div className="mb-6">
                            <h1 className="text-6xl font-bold mb-4 tracking-tight">
                                Reserve<span className="text-amber-200">Ease</span>
                            </h1>
                            <div className="w-24 h-1 bg-white/30 mx-auto mb-6"></div>
                        </div>
                        
                        <p className="text-xl mb-2 font-medium">Event Reservations Made Simple</p>
                        <p className="text-lg opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Book and manage your events with ease at Inwood Tavern. 
                            Select your package, customize your setup, and reserve in just a few clicks.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group px-8 py-4 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                >
                                    <span className="flex items-center justify-center">
                                        Go to Dashboard
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="group px-8 py-4 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                    >
                                        <span className="flex items-center justify-center">
                                            Get Started
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats or Quick Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">500+</div>
                                <div className="text-sm opacity-80">Events Hosted</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">50+</div>
                                <div className="text-sm opacity-80">Package Options</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm opacity-80">Support</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Everything You Need for Perfect Events
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            From intimate gatherings to grand celebrations, we've got you covered
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Browse Packages</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Explore event packages for weddings, birthdays, and more. Each package is carefully curated to make your event unforgettable.
                            </p>
                        </div>
                        
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Customize Reservations</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Pick your food, layout, themes, and entertainment easily. Tailor every detail to match your vision perfectly.
                            </p>
                        </div>
                        
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Track and Pay</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Securely manage payments and get event confirmation instantly. Track your booking status in real-time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="bg-slate-50 py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose ReserveEase?</h3>
                            <p className="text-lg text-slate-600">Experience the difference with our premium service</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-amber-600" />
                                </div>
                                <h4 className="font-semibold text-slate-800 mb-2">Expert Staff</h4>
                                <p className="text-sm text-slate-600">Professional event coordinators</p>
                            </div>
                            
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                                <h4 className="font-semibold text-slate-800 mb-2">Quick Setup</h4>
                                <p className="text-sm text-slate-600">Fast and efficient planning</p>
                            </div>
                            
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-6 h-6 text-amber-600" />
                                </div>
                                <h4 className="font-semibold text-slate-800 mb-2">5-Star Service</h4>
                                <p className="text-sm text-slate-600">Exceptional customer satisfaction</p>
                            </div>
                            
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-amber-600" />
                                </div>
                                <h4 className="font-semibold text-slate-800 mb-2">Prime Location</h4>
                                <p className="text-sm text-slate-600">Beautiful Inwood Tavern venue</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h3 className="text-3xl font-bold mb-4">Ready to Plan Your Perfect Event?</h3>
                        <p className="text-xl text-slate-300 mb-8">
                            Join hundreds of satisfied customers who trust ReserveEase for their special occasions
                        </p>
                        
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Start Planning Today
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400 py-8">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <div className="text-2xl font-bold text-white mb-2">
                                    Reserve<span className="text-amber-400">Ease</span>
                                </div>
                                <p className="text-sm">Making event planning effortless since 2024</p>
                            </div>
                            <div className="text-sm text-center md:text-right">
                                <p>&copy; {new Date().getFullYear()} ReserveEase – Built with Laravel & React</p>
                                <p className="text-slate-500 mt-1">Powered by Inwood Tavern</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}