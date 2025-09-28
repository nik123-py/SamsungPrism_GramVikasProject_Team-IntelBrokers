import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingCartIcon, 
  CurrencyRupeeIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Digital Marketplace',
    description: 'Connect farmers directly with buyers, eliminating middlemen and ensuring fair prices.',
    icon: ShoppingCartIcon,
  },
  {
    name: 'Aggregation Hubs',
    description: 'Village-level processing centers for quality control and bulk logistics.',
    icon: MapPinIcon,
  },
  {
    name: 'Financial Services',
    description: 'Access to microloans, instant payments, and crop insurance.',
    icon: CurrencyRupeeIcon,
  },
  {
    name: 'Community Network',
    description: 'SHG integration and community-driven governance for trust and accountability.',
    icon: UserGroupIcon,
  },
  {
    name: 'Data Analytics',
    description: 'Market insights, price trends, and demand forecasting for better decisions.',
    icon: ChartBarIcon,
  },
  {
    name: 'Multi-Channel Access',
    description: 'Available on smartphones, feature phones (USSD/SMS), and web platforms.',
    icon: PhoneIcon,
  },
];

const stats = [
  { name: 'Farmers Connected', value: '10,000+' },
  { name: 'Villages Covered', value: '500+' },
  { name: 'Trade Volume', value: '₹50 Cr+' },
  { name: 'Average Price Increase', value: '15%' },
];

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Gram-Vikas - Unified Rural Economic Engine</title>
        <meta name="description" content="Connecting farmers, aggregators, and buyers through a unified digital platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold text-blue-600">Gram-Vikas</span>
              </Link>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Features
              </Link>
              <Link href="#about" className="text-sm font-semibold leading-6 text-gray-900">
                About
              </Link>
              <Link href="/marketplace" className="text-sm font-semibold leading-6 text-gray-900">
                Marketplace
              </Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link
                href="/auth/login"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-green-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
          
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Unified Rural Economic Engine
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Connecting smallholder farmers with markets through digital infrastructure, 
                aggregation hubs, and community networks. Increase incomes, reduce waste, 
                and build sustainable rural economies.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/register"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Get started
                </Link>
                <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Complete Solution</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for rural economic growth
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our integrated platform combines digital marketplace, physical infrastructure, 
                financial services, and community networks to create a comprehensive rural economic engine.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform rural economies?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Join thousands of farmers, aggregators, and buyers who are already using Gram-Vikas 
                to build sustainable and profitable rural businesses.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/register"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started today
                </Link>
                <Link href="/marketplace" className="text-sm font-semibold leading-6 text-white">
                  Explore marketplace <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <p className="text-xs leading-5 text-gray-500">
                &copy; 2024 Gram-Vikas. All rights reserved.
              </p>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                Built for rural economic empowerment
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;