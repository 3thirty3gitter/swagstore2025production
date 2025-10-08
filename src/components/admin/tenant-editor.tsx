

'use client';

import { ArrowLeft, PlusCircle, Edit, Trash2, Upload, ArrowUp, ArrowDown, X } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SectionEditorModal } from "@/components/admin/editor/section-editor-modal";
import { useState, useTransition, useRef, useEffect } from "react";
import type { Tenant, Page, Section, Website, HeaderConfig, MenuItem } from "@/lib/types";
import { saveWebsite, uploadFile } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";

type TenantEditorProps = {
    tenant: Tenant;
}

const getDefaultWebsiteData = (): Website => ({
    header: {
        layout: 'centered',
        menuItems: [],
        logoWidth: 96,
    },
    pages: [
        {
            id: 'home',
            name: 'Home',
            path: '/',
            sections: [
              {
                id: `section-${Date.now()}`,
                type: 'Hero Section',
                props: {
                    title: "Welcome to Your Store",
                    text: "Discover our amazing products.",
                    buttonText: "Shop Now",
                    buttonLink: "#products",
                    imageUrl: `https://picsum.photos/seed/${Date.now()}/1200/800`,
                    imageHint: "storefront",
                    imageWidth: 80,
                }
              }
            ]
        }
    ]
});

export function TenantEditor({ tenant }: TenantEditorProps) {
    const { toast } = useToast();
    const [isSaving, startTransition] = useTransition();
    const [website, setWebsite] = useState<Website>(tenant.website || getDefaultWebsiteData());
    const [currentPageId, setCurrentPageId] = useState(website.pages[0]?.id || 'home');
    const [iframeKey, setIframeKey] = useState(0);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow && website.header?.logoWidth) {
            iframe.contentWindow.postMessage({
                type: 'logo-width-update',
                width: website.header.logoWidth
            }, '*');
        }
    }, [website.header?.logoWidth, iframeKey]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
                return;
            }

            if (event.data.type === 'logo-width-live-update') {
                handleHeaderChange('logoWidth', event.data.width, false);
            }
            if (event.data.type === 'logo-width-final-update') {
                handleHeaderChange('logoWidth', event.data.width, true);
            }
            if (event.data.type === 'section-width-live-update') {
                handleSectionPropChange(event.data.sectionId, 'imageWidth', event.data.width, false);
            }
            if (event.data.type === 'section-width-final-update') {
                 handleSectionPropChange(event.data.sectionId, 'imageWidth', event.data.width, true);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [website]);

    const currentPage = website.pages.find(p => p.id === currentPageId);

    const updateWebsiteState = (newWebsite: Website, successMessage: string) => {
        setWebsite(newWebsite);
        startTransition(async () => {
            const result = await saveWebsite(tenant.id, newWebsite);
            if (result.success) {
                toast({
                    title: 'Success',
                    description: successMessage,
                });
                setIframeKey(prev => prev + 1);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Save Failed',
                    description: result.error || 'An unknown error occurred.',
                });
            }
        });
    }

    const handleAddSection = (sectionType: Section['type']) => {
        if (!currentPage) return;
        
        let newSection: Section;
        const defaultId = `section-${Date.now()}`;

        switch(sectionType) {
            case 'Hero Section':
                newSection = {
                    id: defaultId,
                    type: 'Hero Section',
                    props: {
                        title: "New Hero Title",
                        text: "This is a new hero section.",
                        buttonText: "Learn More",
                        buttonLink: "#",
                        imageUrl: `https://picsum.photos/seed/${defaultId}/1200/800`,
                        imageHint: "placeholder",
                        layout: 'center-right',
                        imageWidth: 80,
                    }
                };
                break;
            case 'Image With Text':
                 newSection = {
                    id: defaultId,
                    type: 'Image With Text',
                    props: {
                        title: "Feature Title",
                        text: "Describe your feature here. Talk about the benefits and how it helps your customers.",
                        buttonText: "Learn More",
                        buttonLink: "#",
                        imageUrl: `https://picsum.photos/seed/${defaultId}/800/600`,
                        imageHint: "feature illustration",
                        layout: 'left'
                    }
                };
                break;
            case 'Swag Bucks Tracker':
                newSection = {
                    id: defaultId,
                    type: 'Swag Bucks Tracker',
                    props: {
                        title: "Help Our Team Reach Its Goal!",
                        description: "Every purchase contributes to our fundraiser. See how close we are to unlocking new team gear.",
                        gates: [
                            { id: 'gate1', name: 'New Training Cones', target: 500 },
                            { id: 'gate2', name: 'Team Jerseys', target: 1500 },
                            { id: 'gate3', name: 'Tournament Entry Fee', target: 3000 },
                        ]
                    }
                };
                break;
            case 'Product List':
                newSection = {
                    id: defaultId,
                    type: 'Product List',
                    props: {
                        title: "Our Products",
                        selectedProductIds: [],
                    }
                };
                break;
            default:
                return;
        }

        setEditingSection(newSection);
        setIsEditModalOpen(true);
    }
    
    const handleEditSection = (section: Section) => {
        setEditingSection(section);
        setIsEditModalOpen(true);
    };

    const handleSectionSave = (updatedSection: Section) => {
        const newWebsite = { ...website };
        const pageIndex = newWebsite.pages.findIndex(p => p.id === currentPageId);
        if (pageIndex === -1) return;

        const sectionIndex = newWebsite.pages[pageIndex].sections.findIndex(s => s.id === updatedSection.id);
        
        if (sectionIndex > -1) {
            newWebsite.pages[pageIndex].sections[sectionIndex] = updatedSection;
        } else {
            newWebsite.pages[pageIndex].sections.push(updatedSection);
        }

        updateWebsiteState(newWebsite, `Section ${sectionIndex > -1 ? 'updated' : 'added'} successfully.`);
        setIsEditModalOpen(false);
        setEditingSection(null);
    };

    const handleSectionDelete = (sectionId: string) => {
        const newWebsite = {
            ...website,
            pages: website.pages.map(page => {
                if (page.id === currentPageId) {
                    return {
                        ...page,
                        sections: page.sections.filter(s => s.id !== sectionId)
                    };
                }
                return page;
            })
        };
        updateWebsiteState(newWebsite, "The section has been deleted.");
    }

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        if (!currentPage) return;
        const newSections = Array.from(currentPage.sections);
        const [movedSection] = newSections.splice(index, 1);
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        newSections.splice(newIndex, 0, movedSection);

        const newWebsite = {
            ...website,
            pages: website.pages.map(page =>
                page.id === currentPageId ? { ...page, sections: newSections } : page
            )
        };
        updateWebsiteState(newWebsite, "Section order updated.");
    };

    const handleSectionPropChange = (sectionId: string, prop: string, value: any, save: boolean) => {
        const newWebsite = { ...website };
        const pageIndex = newWebsite.pages.findIndex(p => p.id === currentPageId);
        if (pageIndex === -1) return;
        const sectionIndex = newWebsite.pages[pageIndex].sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return;
        
        const updatedSection = {
            ...newWebsite.pages[pageIndex].sections[sectionIndex],
            props: {
                ...newWebsite.pages[pageIndex].sections[sectionIndex].props,
                [prop]: value
            }
        };
        newWebsite.pages[pageIndex].sections[sectionIndex] = updatedSection;
        setWebsite(newWebsite);

        if(iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'section-width-update',
                sectionId,
                width: value,
            }, '*');
        }

        if(save) {
            startTransition(async () => {
                await saveWebsite(tenant.id, newWebsite);
            });
        }
    };
    
    const handleHeaderChange = (field: keyof HeaderConfig, value: any, save: boolean = true) => {
        const newWebsite = {
            ...website,
            header: {
                ...website.header,
                [field]: value
            }
        };
        setWebsite(newWebsite);
        if(save) {
            startTransition(async () => {
                await saveWebsite(tenant.id, newWebsite);
                setIframeKey(prev => prev + 1);
            });
        }
    };


    const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            toast({ title: 'Uploading...', description: 'Your logo is being uploaded.' });
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
                        handleHeaderChange('logoUrl', result.url);
                        toast({ title: 'Upload successful', description: 'Your logo has been saved.' });
                    } else {
                        toast({ variant: 'destructive', title: 'Upload failed', description: result.error });
                    }
                }
            };
        }
    };
    
    const handleMenuItemChange = (index: number, field: 'label' | 'link', value: string) => {
        const newMenuItems = [...(website.header?.menuItems || [])];
        newMenuItems[index] = { ...newMenuItems[index], [field]: value };

        const newWebsite = {
            ...website,
            header: {
                ...website.header,
                menuItems: newMenuItems,
            }
        };
        setWebsite(newWebsite);
    };

    const addMenuItem = () => {
        const newMenuItem: MenuItem = { id: `menu-${Date.now()}`, label: 'New Link', link: '#' };
        const newMenuItems = [...(website.header?.menuItems || []), newMenuItem];
        const newWebsite = { ...website, header: { ...website.header, menuItems: newMenuItems } };
        setWebsite(newWebsite);
    };

    const removeMenuItem = (index: number) => {
        const newMenuItems = (website.header?.menuItems || []).filter((_, i) => i !== index);
        const newWebsite = { ...website, header: { ...website.header, menuItems: newMenuItems } };
        setWebsite(newWebsite);
    };

    const handleSaveChanges = () => {
        updateWebsiteState(website, 'Your changes have been saved!');
    }

    return (
        <>
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <Link href={`/admin/tenants/${tenant.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-1">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tenant
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight font-headline">
                        Editing: {tenant.storeName}
                    </h1>
                </div>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] flex-1">
                <aside className="border-r overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Editor Controls</h2>
                        <Separator />
                        <Accordion type="multiple" defaultValue={['pages', 'header', 'sections']} className="w-full">
                            <AccordionItem value="pages">
                                <AccordionTrigger className="text-md font-semibold">Pages</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2 pt-2">
                                        {website.pages.map(page => (
                                            <Button key={page.id} variant={page.id === currentPageId ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setCurrentPageId(page.id)}>
                                                {page.name}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-4">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Page
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="header">
                                <AccordionTrigger className="text-md font-semibold">Header</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label>Logo</Label>
                                            {website.header?.logoUrl && (
                                                <div className="relative w-32 h-16 my-2 bg-muted/30 rounded-md flex items-center justify-center p-2">
                                                    <Image src={website.header.logoUrl} alt="Logo preview" layout="fill" objectFit="contain" />
                                                </div>
                                            )}
                                            <input id="logo-upload" type="file" onChange={handleLogoChange} accept="image/*" className="hidden" ref={logoInputRef} />
                                             <Button variant="outline" onClick={() => logoInputRef.current?.click()} className="w-full">
                                                <Upload className="mr-2 h-4 w-4" /> Upload Logo
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="logo-width">Logo Width</Label>
                                                <span className="text-sm text-muted-foreground">{Math.round(website.header?.logoWidth || 96)}px</span>
                                            </div>
                                            <Slider
                                                id="logo-width"
                                                value={[website.header?.logoWidth || 96]}
                                                onValueChange={(value) => handleHeaderChange('logoWidth', value[0], false)}
                                                onValueCommit={(value) => handleHeaderChange('logoWidth', value[0], true)}
                                                min={32}
                                                max={300}
                                                step={1}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="header-type">Header Layout</Label>
                                            <Select value={website.header?.layout || 'centered'} onValueChange={(value) => handleHeaderChange('layout', value)}>
                                                <SelectTrigger id="header-type">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="centered">Centered</SelectItem>
                                                    <SelectItem value="left-aligned">Left Aligned</SelectItem>
                                                    <SelectItem value="minimal">Minimal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <Label>Menu Items</Label>
                                            <div className="space-y-3">
                                                {(website.header?.menuItems || []).map((item, index) => (
                                                    <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                                                        <div className="flex-1 space-y-2">
                                                           <Input placeholder="Label" value={item.label} onChange={(e) => handleMenuItemChange(index, 'label', e.target.value)} />
                                                            <Input placeholder="Link" value={item.link} onChange={(e) => handleMenuItemChange(index, 'link', e.target.value)} />
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeMenuItem(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                             <Button variant="outline" size="sm" className="w-full mt-2" onClick={addMenuItem}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sections">
                                <AccordionTrigger className="text-md font-semibold">Page Sections</AccordionTrigger>
                                <AccordionContent>
                                    {currentPage ? (
                                        <div className="space-y-2 pt-2">
                                            {currentPage.sections.map((section, index) => (
                                                <div
                                                    key={section.id}
                                                    className="flex items-center justify-between rounded-md p-2 bg-muted/50"
                                                >
                                                    <span className="text-sm font-medium">{section.type}</span>
                                                    <div className="flex items-center">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveSection(index, 'up')} disabled={index === 0}>
                                                            <ArrowUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveSection(index, 'down')} disabled={index === currentPage.sections.length - 1}>
                                                            <ArrowDown className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSection(section)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete this section from the page.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleSectionDelete(section.id)}>
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            ))}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full mt-4">
                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                        Add Section
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[310px]">
                                                    <DropdownMenuItem onSelect={() => handleAddSection('Hero Section')}>
                                                        Hero Section
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleAddSection('Image With Text')}>
                                                        Image With Text
                                                    </DropdownMenuItem>
                                                     <DropdownMenuItem onSelect={() => handleAddSection('Product List')}>
                                                        Product List
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleAddSection('Swag Bucks Tracker')}>
                                                        Swag Bucks Tracker
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 pt-2 text-center text-muted-foreground">
                                            <p className="text-sm">Select a page to view and add sections.</p>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </aside>
                <main className="flex-1 bg-muted/20">
                    <iframe
                        ref={iframeRef}
                        key={iframeKey}
                        src={`/${tenant.slug}?v=${iframeKey}`}
                        title={`Storefront preview for ${tenant.storeName}`}
                        className="w-full h-full border-0"
                    />
                </main>
            </div>
        </div>
        {isEditModalOpen && editingSection && (
            <SectionEditorModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingSection(null); }}
                section={editingSection}
                onSave={handleSectionSave}
                tenantId={tenant.id}
            />
        )}
        </>
    );
}
