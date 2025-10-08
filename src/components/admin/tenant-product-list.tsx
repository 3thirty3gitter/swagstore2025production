import type { Product } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type TenantProductListProps = {
    products: Product[];
}

export function TenantProductList({ products }: TenantProductListProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">No products assigned</h2>
                <p className="text-muted-foreground mt-2">Assign products to this tenant to see them here.</p>
            </div>
        )
    }
    
    return (
        <div className="rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Variants</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map(product => {
                        const mainImage = product.images?.[0];
                        return (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {mainImage ? (
                                        <Image
                                            src={mainImage.src}
                                            alt={mainImage.alt}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover aspect-square"
                                            data-ai-hint={mainImage.hint}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-muted rounded-md" />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{product.category}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{product.variants?.length || 0}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
