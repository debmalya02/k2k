// 'use client'
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// // Define types for search result
// interface SearchResult {
//   product: {
//     name: string
//     description: string
//   }
//   batch: {
//     number: string
//     testReport: string
//   }
//   serialNumber: {
//     number: string
//     status: string
//   }
// }

// export default function CustomerSearch() {
//   const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     // Simulating an API response
//     setSearchResult({
//       product: {
//         name: 'Sample Product',
//         description: 'This is a sample product description.',
//       },
//       batch: {
//         number: 'BATCH001',
//         testReport: 'https://example.com/test-report.pdf',
//       },
//       serialNumber: {
//         number: 'SN001',
//         status: 'active',
//       },
//     })
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-auto">
//       <h1 className="text-3xl font-bold mb-6">Customer Search</h1>
//       <form onSubmit={handleSearch} className="space-y-4 mb-8">
//         <div>
//           <Label htmlFor="batchNumber">Batch Number</Label>
//           <Input id="batchNumber" name="batchNumber" />
//         </div>
//         <div>
//           <Label htmlFor="serialNumber">Serial Number</Label>
//           <Input id="serialNumber" name="serialNumber" />
//         </div>
//         <Button type="submit">Search</Button>
//       </form>

//       {searchResult && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Search Result</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold">Product Details</h3>
//                 <p>Name: {searchResult.product.name}</p>
//                 <p>Description: {searchResult.product.description}</p>
//               </div>
//               <div>
//                 <h3 className="font-semibold">Batch Information</h3>
//                 <p>Batch Number: {searchResult.batch.number}</p>
//                 <p>
//                   Test Report:{' '}
//                   <a
//                     href={searchResult.batch.testReport}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     View Report
//                   </a>
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-semibold">Serial Number Information</h3>
//                 <p>Serial Number: {searchResult.serialNumber.number}</p>
//                 <p>Status: {searchResult.serialNumber.status}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }


'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function CustomerSearch() {
  const [serialNumber, setSerialNumber] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (serialNumber) {
      // Redirect to the result page with the serial number
      router.push(`/customer/${serialNumber}`)
    }
  }

  return (
    <div className="max-w-md mx-auto my-auto p-8 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Verification</h1>
      <form onSubmit={handleSearch} className="space-y-6">
        <div>
          <Label htmlFor="serialNumber">Enter Serial Number</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Search Product</Button>
      </form>
    </div>
  )
}
