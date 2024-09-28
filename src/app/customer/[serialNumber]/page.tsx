'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SearchResult {
  product: {
    name: string
    description: string
  }
  batch: {
    number: string
    testReport: string
  }
  serialNumber: {
    number: string
    status: string
  }
}

export default function ProductDetails({ params }: { params: { serialNumber: string } }) {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call with the serial number and update the state with the results
    const fetchedResult = {
      product: {
        name: 'Sample Product',
        description: 'This is a sample product description.',
      },
      batch: {
        number: 'BATCH001',
        testReport: 'https://example.com/test-report.pdf',
      },
      serialNumber: {
        number: params.serialNumber,
        status: 'active',
      },
    }

    setSearchResult(fetchedResult)
  }, [params.serialNumber])

  if (!searchResult) {
    return <p>Loading...</p>
  }

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white shadow-lg rounded-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Product Verification Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-xl">Product Details</h3>
            <p><strong>Name:</strong> {searchResult.product.name}</p>
            <p><strong>Description:</strong> {searchResult.product.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Batch Information</h3>
            <p><strong>Batch Number:</strong> {searchResult.batch.number}</p>
            <p>
              <strong>Test Report:</strong>{' '}
              <a
                href={searchResult.batch.testReport}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Report
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Serial Number Information</h3>
            <p><strong>Serial Number:</strong> {searchResult.serialNumber.number}</p>
            <p><strong>Status:</strong> {searchResult.serialNumber.status}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
