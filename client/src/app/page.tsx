import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, CloudUpload, Zap, Lock, Search, LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon;
  text: string;
}

const features: Feature[] = [
  { icon: Zap, text: "Intelligent caching for instant access" },
  { icon: Lock, text: "Secure pre-signed share links" },
  { icon: Search, text: "Efficient search with smart filtering" },
]

interface FeatureItemProps {
  Icon: LucideIcon;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ Icon, text }) => (
  <li className="flex items-center text-white text-lg group">
    <Icon className="mr-3 h-6 w-6 text-[#22c55e] group-hover:text-white transition-colors duration-300" />
    <span className="group-hover:text-[#22c55e] transition-colors duration-300">{text}</span>
  </li>
)

interface ActionButtonProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  primary?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ href, icon: Icon, children, primary = false }) => (
  <Button 
    asChild 
    size="lg" 
    variant={primary ? "default" : "outline"}
    className={`w-full ${primary 
      ? "bg-[#22c55e] hover:bg-[#1ea34b] text-white" 
      : "border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white"
    } transition-colors duration-300`}
  >
    <Link href={href} className="flex items-center justify-center">
      <Icon className="mr-2 h-5 w-5" /> {children}
    </Link>
  </Button>
)

const Home: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#1c1c1c] text-white p-4">
      <Card className="w-full max-w-4xl bg-[#242424] border-[#2a2a2a] shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-[#1e1e1e] p-8 flex flex-col justify-center">
            <CardHeader className="text-center pb-8">
              <CloudUpload className="h-20 w-20 text-[#22c55e] mx-auto mb-4 animate-bounce" />
              <CardTitle className="text-4xl text-white font-bold mb-4">
                Go Store S3
              </CardTitle>
              <CardDescription className="text-xl text-gray-400">
                Manage Files with Ease on S3
              </CardDescription>
            </CardHeader>
          </div>
          <div className="md:w-1/2 p-8">
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-[#22c55e]">
                Powerful Features
              </h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <FeatureItem key={index} Icon={feature.icon} text={feature.text} />
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-8">
              <ActionButton href="/login" icon={LogIn} primary>
                Login
              </ActionButton>
              <ActionButton href="/register" icon={UserPlus}>
                Register
              </ActionButton>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Home