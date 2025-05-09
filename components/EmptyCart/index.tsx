"use client"
import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const EmptyCart = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-r from-rose-100 to-teal-100">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg"
          >
            <ShoppingCart size={64} className="text-gray-400" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-3"
          >
            Your Cart is Empty
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-gray-500 mb-8"
          >
            Looks like you haven't added anything to your cart yet.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <Link href="/">
              <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue Shopping
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default EmptyCart



