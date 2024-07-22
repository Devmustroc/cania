"use client";

import React from 'react';
import {ResponderType, useGetTemplates} from "@/features/projects/api/use-get-template";
import {AlertTriangle, Loader2} from "lucide-react";
import TemplateCard from "@/app/(dashboard)/_components/template-card";
import {useCreateProject} from "@/features/projects/api/use-create-project";
import {useRouter} from "next/navigation";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";

const TemplatesSection = () => {
    const paywall = usePaywall();
    const mutation = useCreateProject();
    const {data, isLoading, isError} = useGetTemplates({
        page: "1",
        limit: "4"
    });
    const router = useRouter();

    const onClick = (template: ResponderType['data'][0]) => {
        if (template.isPro && paywall.shouldBeBlock) {
            paywall.triggerPaywall();
            return;
        }

        mutation.mutate(
            {
                name: `${template.name} - Copy`,
                json: template.json,
                width: template.width,
                height: template.height
            },
            {
                onSuccess: ({ data }) => {
                    router.push(`/editor/${data.id}`);
                }
            }
        )
    }

    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center text-center"
            >
               <Loader2
                     size="32"
                     className="mx-auto  animate-spin text-muted-foreground"
               />
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="text-center"
            >
                <AlertTriangle
                    size="32"
                    className="mx-auto text-muted-foreground"
                />
                <p>
                    Failed to fetch templates
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3
                className="text-2xl font-semibold"
            >
                Start with a Template
            </h3>
            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
            >
                {
                    data?.map((template) => (
                        <TemplateCard
                            key={template.id}
                            title={template.name}
                            imageSrc={template.thumbnail || ""}
                            onClick={() => onClick(template)}
                            disabled={mutation.isPending}
                            isPremium={template.isPro || false}
                            description={`${template.width} x ${template.height}}`}
                            width={template.width}
                            height={template.height}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default TemplatesSection;