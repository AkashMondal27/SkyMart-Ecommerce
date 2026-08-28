import { Moon, Settings, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger 
             render={
                <Button
                    variant="outline"
                    size="icon"
                    className="
                        relative
                        cursor-pointer
                        transition-all
                        duration-300

                        text-gray-700
                        border-gray-300

                        hover:text-orange-500
                        hover:bg-orange-50
                        hover:border-orange-300

                        dark:text-gray-200
                        dark:bg-[#0d1424]
                        dark:border-blue-900/50

                        dark:hover:text-blue-400
                        dark:hover:bg-blue-950/60
                        dark:hover:border-blue-500/50
                        dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.35)]
                    ">
                

                
                    <Sun
                        className="
                            h-[1.2rem]
                            w-[1.2rem]
                            scale-100
                            rotate-0
                            transition-all
                            duration-300
                            dark:scale-0
                            dark:-rotate-90
                        "
                    />

                    <Moon
                        className="
                            absolute
                            h-[1.2rem]
                            w-[1.2rem]
                            scale-0
                            rotate-90
                            transition-all
                            duration-300
                            dark:scale-100
                            dark:rotate-0
                        "
                    />

                    <span className="sr-only">
                        Toggle theme
                    </span>
                 </Button>
                }/>
            {/* </DropdownMenuTrigger> */}

            <DropdownMenuContent
                align="end"
                className="
                    dark:bg-[#0d1424]
                    dark:border-blue-900/50
                    dark:shadow-[0_8px_30px_rgba(37,99,235,0.18)]
                "
            >
                <DropdownMenuItem
                    className="
                        cursor-pointer
                        hover:bg-orange-50
                        hover:text-orange-500

                        dark:hover:bg-blue-950/60
                        dark:hover:text-blue-400
                    "
                    onClick={() => setTheme("light")}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="
                        cursor-pointer
                        hover:bg-orange-50
                        hover:text-orange-500

                        dark:hover:bg-blue-950/60
                        dark:hover:text-blue-400
                    "
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="
                        cursor-pointer
                        hover:bg-orange-50
                        hover:text-orange-500

                        dark:hover:bg-blue-950/60
                        dark:hover:text-blue-400
                    "
                    onClick={() => setTheme("system")}
                >
                  <Settings className="mr-2 h-4 w-4"/>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}