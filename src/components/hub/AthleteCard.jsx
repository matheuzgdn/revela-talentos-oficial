import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield } from 'lucide-react';

export default function AthleteCard({ athlete }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="w-48 flex-shrink-0 cursor-pointer group"
        >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors duration-300 overflow-hidden">
                <CardContent className="p-4 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-gray-700 group-hover:border-blue-500 transition-colors">
                        <AvatarImage src={athlete.profile_picture_url} alt={athlete.full_name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold">
                            {athlete.full_name?.charAt(0) || 'A'}
                        </AvatarFallback>
                    </Avatar>
                    <h4 className="text-base font-bold text-white truncate">{athlete.full_name}</h4>
                    <p className="text-sm text-blue-300">{athlete.position}</p>
                    {athlete.club && (
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-gray-400">
                            <Shield className="w-3 h-3" />
                            <span className="truncate">{athlete.club}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}