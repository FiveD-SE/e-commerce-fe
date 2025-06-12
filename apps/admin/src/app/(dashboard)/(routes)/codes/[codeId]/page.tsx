import prisma from '@/lib/prisma'
import { CodeForm } from './components/code-form'

const CodePage = async ({ params }: { params: { codeId: string } }) => {
    const code = await prisma.discountCode.findUnique({
        where: {
            id: params.codeId,
        },
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CodeForm initialData={code} />
            </div>
        </div>
    )
}

export default CodePage 