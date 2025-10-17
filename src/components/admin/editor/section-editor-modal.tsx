

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, PlusCircle, Trash2, X } from 'lucide-react';
import type { Section, HeroSectionLayout, ImageWithTextLayout, SwagBucksGate, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';


type SectionEditorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    section: Section;
    onSave: (updatedSection: Section) => void;
    tenantId: string;
    tenantProducts: Product[];
};

export function SectionEditorModal({ isOpen, onClose, section, onSave, tenantId, tenantProducts }: SectionEditorModalProps) {
    const [currentSection, setCurrentSection] = useState<Section>(section);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setCurrentSection(section);
        }
    }, [section, isOpen]);

    const handleSave = () => {
        onSave(currentSection);
        onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCurrentSection(prev => ({
            ...prev,
            props: { ...prev.props, [id]: value }
        }));
    }
    
    const handleValueChange = (id: string, value: any) => {
        setCurrentSection(prev => ({
            ...prev,
            props: { ...prev.props, [id]: value }
        }));
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                        setCurrentSection(prev => ({
                            ...prev,
                            props: { ...prev.props, imageUrl: result.url }
                        }));
                        toast({ title: 'Upload successful', description: 'Image updated. Click Save to apply changes.' });
                    } else {
                        toast({ variant: 'destructive', title: 'Upload failed', description: result.error });
                    }
                }
            };
        }
        if (event.target) {
            event.target.value = '';
        }
    };
    
    const renderCommonFields = (props: any) => (
         <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                    Title
                </Label>
                <Input
                    id="title"
                    value={props.title || ''}
                    onChange={handleChange}
                    className="col-span-3"
                />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                    Text
                </Label>
                <Textarea
                    id="text"
                    value={props.text || ''}
                    onChange={handleChange}
                    className="col-span-3"
                    rows={5}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonText" className="text-right">
                    Button Text
                </Label>
                <Input
                    id="buttonText"
                    value={props.buttonText || ''}
                    onChange={handleChange}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonLink" className="text-right">
                    Button Link
                </Label>
                <Input
                    id="buttonLink"
                    value={props.buttonLink || ''}
                    onChange={handleChange}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                    Image
                </Label>
                <div className="col-span-3 space-y-2">
                     {props.imageUrl && (
                        <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden">
                            <Image src={props.imageUrl} alt="Section image preview" fill className="object-contain" />
                        </div>
                     )}
                     <div className="flex gap-2">
                        <Input
                            id="imageUrl"
                            value={props.imageUrl || ''}
                            onChange={handleChange}
                            className="flex-grow"
                            placeholder="https://..."
                        />
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderHeroSectionForm = (props: any) => (
      <div className="grid gap-4 py-4">
        {renderCommonFields(props)}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="layout" className="text-right">
            Text Position
          </Label>
          <Select value={props.layout || 'center-left'} onValueChange={(value: HeroSectionLayout) => handleValueChange('layout', value)}>
            <SelectTrigger id="layout" className="col-span-3">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="center-left">Center Left</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="center-right">Center Right</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageWidth" className="text-right">Image Width</Label>
            <div className='col-span-3 flex items-center gap-4'>
                <Slider
                    id="imageWidth"
                    value={[props.imageWidth || 80]}
                    onValueChange={(value) => handleValueChange('imageWidth', value[0])}
                    min={25}
                    max={90}
                    step={1}
                />
                <span className='text-sm text-muted-foreground w-16 text-right'>{Math.round(props.imageWidth || 80)}%</span>
            </div>
        </div>
      </div>
    );
    
    const renderImageWithTextForm = (props: any) => (
         <div className="grid gap-4 py-4">
            {renderCommonFields(props)}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="layout" className="text-right">
                    Image Position
                </Label>
                 <Select value={props.layout || 'left'} onValueChange={(value: ImageWithTextLayout) => handleValueChange('layout', value)}>
                    <SelectTrigger id="layout" className="col-span-3">
                        <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Image Left, Text Right</SelectItem>
                        <SelectItem value="right">Image Right, Text Left</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderSwagBucksTrackerForm = (props: any) => {
        const handleGateChange = (index: number, field: 'name' | 'target', value: string | number) => {
            const newGates = [...(props.gates || [])];
            newGates[index] = { ...newGates[index], [field]: value };
            handleValueChange('gates', newGates);
        }

        const addGate = () => {
            const newGate: SwagBucksGate = { id: `gate-${Date.now()}`, name: 'New Prize', target: (props.gates?.slice(-1)[0]?.target || 0) + 1000 };
            handleValueChange('gates', [...(props.gates || []), newGate]);
        }

        const removeGate = (id: string) => {
            handleValueChange('gates', props.gates.filter((g: SwagBucksGate) => g.id !== id));
        }

        return (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                    </Label>
                    <Input
                        id="title"
                        value={props.title || ''}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={props.description || ''}
                        onChange={handleChange}
                        className="col-span-3"
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">
                        Milestones
                    </Label>
                    <div className="col-span-3 space-y-2">
                        {(props.gates || []).map((gate: SwagBucksGate, index: number) => (
                            <div key={gate.id} className="flex gap-2 items-center">
                                <Input 
                                    placeholder="Milestone Name" 
                                    value={gate.name}
                                    onChange={(e) => handleGateChange(index, 'name', e.target.value)}
                                />
                                <Input 
                                    type="number"
                                    placeholder="Target Points" 
                                    value={gate.target}
                                    onChange={(e) => handleGateChange(index, 'target', Number(e.target.value))}
                                    className="w-32"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeGate(gate.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                         <Button variant="outline" size="sm" onClick={addGate}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
                        </Button>
                    </div>
                </div>
            </div>
        )
    };
    
    const renderProductListForm = (props: any) => {
        const [open, setOpen] = useState(false);
        const selectedProductIds = props.selectedProductIds || [];
        
        const orderedSelectedProducts = tenantProducts 
            ? selectedProductIds
                .map((id: string) => tenantProducts.find(p => p.id === id))
                .filter((p: Product | undefined): p is Product => p !== undefined)
            : [];

        const handleSelectProduct = (productId: string) => {
            const newSelectedIds = selectedProductIds.includes(productId)
                ? selectedProductIds.filter((id: string) => id !== productId)
                : [...selectedProductIds, productId];
            handleValueChange('selectedProductIds', newSelectedIds);
        }

        return (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                    </Label>
                    <Input
                        id="title"
                        value={props.title || ''}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">
                        Products
                    </Label>
                    <div className="col-span-3">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedProductIds.length > 0
                                        ? `${selectedProductIds.length} products selected`
                                        : "Select products..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[375px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search products..." />
                                    <CommandList>
                                        <CommandEmpty>No products found.</CommandEmpty>
                                        <CommandGroup>
                                            {tenantProducts?.map((product) => (
                                            <CommandItem
                                                key={product.id}
                                                value={product.name}
                                                onSelect={(currentValue) => {
                                                    handleSelectProduct(product.id)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedProductIds.includes(product.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {product.name}
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {orderedSelectedProducts.map(p => (
                                <Badge key={p.id} variant="secondary">
                                    {p.name}
                                    <button onClick={() => handleSelectProduct(p.id)} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                         <p className="text-xs text-muted-foreground mt-2">
                            The order of products is preserved. If no products are selected, all available products for this tenant will be shown.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderForm = () => {
        const props = currentSection.props;
        switch (currentSection.type) {
            case 'Hero Section':
                return renderHeroSectionForm(props);
            case 'Image With Text':
                 return renderImageWithTextForm(props);
            case 'Swag Bucks Tracker':
                return renderSwagBucksTrackerForm(props);
            case 'Product List':
                return renderProductListForm(props);
            default:
                return <p>Unsupported section type.</p>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit {currentSection.type}</DialogTitle>
                </DialogHeader>
                {renderForm()}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
