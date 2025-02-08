"use client"

import * as React from "react"
import { GripVertical, GripHorizontal } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.Panel ref={ref} className={cn("flex grow basis-0", className)} {...props} />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-white/10 transition-colors hover:bg-white/20",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <motion.div
        className="z-10 flex h-8 w-3 items-center justify-center rounded-sm border border-white/10 bg-black"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {props["data-panel-group-direction"] === "vertical" ? (
          <GripHorizontal className="h-2.5 w-2.5 text-white/40" />
        ) : (
          <GripVertical className="h-2.5 w-2.5 text-white/40" />
        )}
      </motion.div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

