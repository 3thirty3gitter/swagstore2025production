
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {
  Product,
  Tenant,
  ProductOption,
  ProductVariant,
  ProductImage,
} from '@/lib/types';
import {Checkbox} from '../ui/checkbox';
import {useToast} from '@/hooks/use-toast';
import {
  saveProduct, uploadFile,
} from '@/lib/actions';
import {
  Sparkles,
  Loader2,
  X,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {Badge} from '../ui/badge';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {useServerFormState} from '@/hooks/use-server-form-state';
import {useRef, useState, useEffect, useTransition} from 'react';

type ProductFormProps = {
  product?: Product | null;
  tenants: Tenant[];
  onSuccess: () => void;
};

const MAX_OPTIONS = 3;

export function ProductForm({product, tenants, onSuccess}: ProductFormProps) {
  const {
    formState,
    formAction,
    register,
    formErrors,
    setValue,
    watch,
    isSuccess,
  } = useServerFormState(saveProduct, product);

  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [options, setOptions] = useState<ProductOption[]>(product?.options || []);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
  
  useEffect(() => {
    setValue('images', JSON.stringify(images));
  }, [images, setValue]);

  useEffect(() => {
    setValue('options', JSON.stringify(options));
  }, [options, setValue]);
  
  useEffect(() => {
    setValue('variants', JSON.stringify(variants));
  }, [variants, setValue]);


  useEffect(() => {
    if(isSuccess) {
      toast({
        title: product ? 'Product Updated' : 'Product Created',
        description: `The product "${watch('name')}" has been saved successfully.`,
      });
      onSuccess();
    }
  }, [isSuccess, onSuccess, product, watch, toast]);

  const name = watch('name', product?.name || '');
  const category = watch('category', product?.category || '');
  const description = watch('description', product?.description || '');
  
  const generateVariants = (currentOptions: ProductOption[]) => {
    if (!currentOptions || currentOptions.length === 0) {
      if(variants.length <= 1 && (variants[0]?.title === 'Default Title' || variants.length === 0)) {
         setVariants([
          {
            id: 'new-var-1',
            productId: product?.id || 'new',
            title: 'Default Title',
            option1: 'Default Title',
            option2: null,
            option3: null,
            price: 0,
            compareAtPrice: null,
            sku: '',
            imageId: images?.[0]?.id || null,
            inventoryManagement: 'none',
            inventoryQuantity: 0,
            requiresShipping: true,
          },
        ]);
      }
      return;
    }

    const valueArrays = currentOptions.map(opt =>
      opt.values.filter(v => v.trim() !== '')
    );

    if (valueArrays.some(arr => arr.length === 0)) {
      setVariants([]);
      return;
    }

    const cartesian = (...a: string[][]): string[][] =>
      a.reduce((acc, val) => acc.flatMap(d => val.map(e => [d, e].flat())), [[]] as string[][]);

    const newVariantCombinations = cartesian(...valueArrays);

    if (newVariantCombinations.length > 100) {
      toast({
        variant: 'destructive',
        title: 'Too many variants',
        description: 'Products can have a maximum of 100 variants.',
      });
      return;
    }

    const newVariants = newVariantCombinations.map((combination, index) => {
      const title = combination.join(' / ');
      const existingVariant = variants.find(v => v.title === title);

      return {
        id: existingVariant?.id || `new-var-${Date.now()}-${index}`,
        productId: product?.id || 'new',
        title,
        option1: combination[0] || null,
        option2: combination[1] || null,
        option3: combination[2] || null,
        price: existingVariant?.price || 0,
        compareAtPrice: existingVariant?.compareAtPrice || null,
        sku: existingVariant?.sku || '',
        imageId: existingVariant?.imageId || images[0]?.id || null,
        inventoryManagement: existingVariant?.inventoryManagement || 'none',
        inventoryQuantity: existingVariant?.inventoryQuantity || 0,
        requiresShipping: existingVariant?.requiresShipping ?? true,
      };
    });

    setVariants(newVariants);
  };

  const handleOptionsUpdate = (newOptions: ProductOption[]) => {
    setOptions(newOptions);
    generateVariants(newOptions);
  };

  const handleImagesUpdate = (newImages: ProductImage[]) => {
    setImages(newImages);
    const validImageIds = new Set(newImages.map(img => img.id));
    let variantsUpdated = false;
    const updatedVariants = variants.map(v => {
      if (v.imageId && !validImageIds.has(v.imageId)) {
        variantsUpdated = true;
        return {...v, imageId: newImages[0]?.id || null};
      }
      return v;
    });

    if (variantsUpdated) {
      setVariants(updatedVariants);
    }
  };

  const handleOptionNameChange = (index: number, name: string) => {
    const newOptions = [...options];
    newOptions[index].name = name;
    handleOptionsUpdate(newOptions);
  };

  const handleOptionValuesChange = (index: number, values: string) => {
    const newOptions = [...options];
    newOptions[index].values = values.split(',').map(s => s.trim());
    handleOptionsUpdate(newOptions);
  };

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      if (
        options.length === 0 &&
        variants.length === 1 &&
        variants[0].title === 'Default Title'
      ) {
        setVariants([]);
      }
      handleOptionsUpdate([
        ...options,
        {id: `new-opt-${Date.now()}`, name: '', values: []},
      ]);
    }
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter(
      (_, i) => i !== index
    );
    handleOptionsUpdate(newOptions);
  };

  const handleVariantChange = (
    variantId: string,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants(
      variants.map(v => (v.id === variantId ? {...v, [field]: value} : v))
    );
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: 'Uploading...', description: 'Your image is being uploaded.' });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (loadEvent) => {
          const dataUrl = loadEvent.target?.result as string;
          if (dataUrl) {
              const formData = new FormData();
              formData.append('dataUrl', dataUrl);
              formData.append('fileName', file.name);
              const result = await uploadFile(null, formData);

              if (result.success && result.url) {
                const newImage: ProductImage = {
                  id: `new-img-${Date.now()}`,
                  src: result.url,
                  alt: file.name,
                  hint: 'uploaded image',
                };
                handleImagesUpdate([...images, newImage]);
                toast({ title: 'Upload successful', description: 'Image has been added.' });
              } else {
                  toast({ variant: 'destructive', title: 'Upload failed', description: result.error });
              }
          }
      };
    }
    // Reset file input to allow uploading the same file again
    if(event.target) {
      event.target.value = '';
    }
  };

  const addImage = () => {
    const id = `new-img-${Date.now()}`;
    const newImage: ProductImage = {
      id,
      src: 'https://picsum.photos/seed/' + id + '/600/400',
      alt: 'New product image',
      hint: 'product',
    };
    handleImagesUpdate([...images, newImage]);
  };

  const removeImage = (id: string) => {
    handleImagesUpdate(
      images.filter(img => img.id !== id)
    );
  };

  return (
    <DialogContent className="sm:max-w-6xl">
      <DialogHeader>
        <DialogTitle>
          {product ? 'Edit Product' : 'Create New Product'}
        </DialogTitle>
        <DialogDescription>
          Fill in the details for the product. Add options to create variants.
        </DialogDescription>
      </DialogHeader>
      <form
        id="product-form"
        action={formAction}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[80vh] overflow-y-auto px-1"
      >
        <input type="hidden" {...register('id')} value={product?.id || ''} />
        <input
          type="hidden"
          {...register('images')}
        />
        <input
          type="hidden"
          {...register('options')}
        />
        <input
          type="hidden"
          {...register('variants')}
        />

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register('name')} />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
            </div>
            <Textarea id="description" {...register('description')} rows={5} />
          </div>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Images</h3>
            </div>
            
            <div className='flex gap-2'>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Placeholder Image
              </Button>
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {images.map(image => (
                  <div key={image.id} className="relative group aspect-square">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint={image.hint}
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                <p>No images added.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} />
            {formErrors.category && (
              <p className="text-sm text-destructive">
                {formErrors.category[0]}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <Label>Assign to Tenants</Label>
            <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
              {tenants.map(tenant => (
                <div key={tenant.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tenant-${tenant.id}`}
                    value={tenant.id}
                    {...register('tenantIds')}
                    defaultChecked={product?.tenantIds?.includes(tenant.id)}
                  />
                  <Label
                    htmlFor={`tenant-${tenant.id}`}
                    className="font-normal"
                  >
                    {tenant.name}
                  </Label>
                </div>
              ))}
            </div>
            {formErrors.tenantIds && (
              <p className="text-sm text-destructive">
                {formErrors.tenantIds[0]}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-3 space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Variants</h3>

          {options.map((option, index) => (
            <div
              key={option.id}
              className="grid grid-cols-1 gap-4 sm:grid-cols-12 rounded-md border p-3 relative"
            >
              <div className="space-y-2 sm:col-span-4">
                <Label htmlFor={`option-name-${index}`}>Option Name</Label>
                <Input
                  id={`option-name-${index}`}
                  placeholder="e.g. Size"
                  value={option.name}
                  onChange={e => handleOptionNameChange(index, e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-8">
                <Label htmlFor={`option-values-${index}`}>
                  Option Values (comma-separated)
                </Label>
                <Input
                  id={`option-values-${index}`}
                  placeholder="e.g. Small, Medium, Large"
                  value={option.values.join(', ')}
                  onChange={e =>
                    handleOptionValuesChange(index, e.target.value)
                  }
                />
              </div>
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {options.length < MAX_OPTIONS && (
            <Button type="button" variant="outline" onClick={addOption}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add another option
            </Button>
          )}

          {variants.length > 0 && (
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead className="w-40">Price</TableHead>
                    <TableHead className="w-40">Compare-at price</TableHead>
                    <TableHead className="w-48">Inventory</TableHead>
                    <TableHead className="w-48">SKU</TableHead>
                    <TableHead className="w-24 text-center">Shipping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map(variant => {
                    const variantImage = images.find(
                      img => img.id === variant.imageId
                    );
                    return (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-12 h-12 p-0 border"
                                disabled={images.length === 0}
                              >
                                {variantImage ? (
                                  <Image
                                    src={variantImage.src}
                                    alt={variantImage.alt}
                                    width={48}
                                    height={48}
                                    className="object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-secondary rounded-md">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                              <div className="grid grid-cols-4 gap-2">
                                {images.map(img => (
                                  <button
                                    key={img.id}
                                    type="button"
                                    onClick={() =>
                                      handleVariantChange(
                                        variant.id,
                                        'imageId',
                                        img.id
                                      )
                                    }
                                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                                      variant.imageId === img.id
                                        ? 'border-primary'
                                        : 'border-transparent'
                                    }`}
                                  >
                                    <Image
                                      src={img.src}
                                      alt={img.alt}
                                      width={64}
                                      height={64}
                                      className="object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="font-medium align-top py-3">
                          {variant.title === 'Default Title'
                            ? 'Default'
                            : variant.title
                                .split(' / ')
                                .map(t => (
                                  <Badge
                                    key={t}
                                    variant="outline"
                                    className="mr-1"
                                  >
                                    {t}
                                  </Badge>
                                ))}
                        </TableCell>
                        <TableCell className="align-top py-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={e =>
                              handleVariantChange(
                                variant.id,
                                'price',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-8"
                            aria-label="Price"
                          />
                        </TableCell>
                        <TableCell className="align-top py-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.compareAtPrice || ''}
                            onChange={e =>
                              handleVariantChange(
                                variant.id,
                                'compareAtPrice',
                                parseFloat(e.target.value) || null
                              )
                            }
                            className="h-8"
                            placeholder="None"
                            aria-label="Compare at price"
                          />
                        </TableCell>
                        <TableCell className="align-top py-3">
                          <div className="flex gap-2">
                            <Select
                              value={variant.inventoryManagement}
                              onValueChange={(value: 'shopify' | 'none') =>
                                handleVariantChange(
                                  variant.id,
                                  'inventoryManagement',
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-28 text-xs"
                                aria-label="Inventory Tracking"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">
                                  Not tracked
                                </SelectItem>
                                <SelectItem value="shopify">Tracked</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={variant.inventoryQuantity}
                              onChange={e =>
                                handleVariantChange(
                                  variant.id,
                                  'inventoryQuantity',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="h-8 w-20"
                              disabled={
                                variant.inventoryManagement === 'none'
                              }
                              aria-label="Inventory Quantity"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="align-top py-3">
                          <Input
                            value={variant.sku || ''}
                            onChange={e =>
                              handleVariantChange(
                                variant.id,
                                'sku',
                                e.target.value
                              )
                            }
                            className="h-8"
                            aria-label="SKU"
                          />
                        </TableCell>
                        <TableCell className="align-top text-center py-3">
                          <Checkbox
                            checked={variant.requiresShipping}
                            onCheckedChange={checked =>
                              handleVariantChange(
                                variant.id,
                                'requiresShipping',
                                checked
                              )
                            }
                            aria-label="Requires Shipping"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form="product-form"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
