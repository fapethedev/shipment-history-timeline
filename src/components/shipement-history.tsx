"use client"

import React, {useEffect, useRef, useState} from 'react'
import {format, parseISO} from 'date-fns'
import {ShipmentEvent} from "@/types/shipments";
import '@cds/core/icon/register.js';
import {checkIcon, ClarityIcons, mapMarkerIcon} from '@cds/core/icon';

interface ShipmentHistoryProps {
    events: ShipmentEvent[];
}

const ShipmentHistory: React.FC<ShipmentHistoryProps> = ({ events }) => {

    ClarityIcons.addIcons(checkIcon);
    ClarityIcons.addIcons(mapMarkerIcon)

    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                setIsSticky(window.scrollY > stickyRef.current.offsetTop)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []);

    const toggleComment = (eventDateTime: string) => {
        setExpandedComments(prev => ({
            ...prev,
            [eventDateTime]: !prev[eventDateTime]
        }))
    };

    const getStatusIcon = (status: string, event: ShipmentEvent) => {
        if (status === "DELIVERED") {
            return (
                <div className={`mx-auto h-9 w-9 rounded-full justify-center items-center border-4 border-[${getLineColor(event)}]`}>
                    <div className={`w-6 h-6 text-[${getLineColor(event)}] fill-[${getLineColor(event)}] justify-center items-center mx-auto my-auto`}>
                        <cds-icon shape="circle"></cds-icon>
                    </div>
                </div>
            );
        } else if (status === "ARRIVED AT YOUR PLACE") {
            return (
                <div className={`mx-auto h-9 w-9 rounded-full justify-center items-center border-4 border-[${getLineColor(event)}]`}>
                    <div className={`w-6 h-6 text-[${getLineColor(event)}] fill-[${getLineColor(event)}] justify-center items-center mx-auto my-auto`}>
                        <cds-icon shape="map-marker"></cds-icon>
                    </div>
                </div>
            );
        }

        return  (
            <div className={`h-4 w-4 rounded-full bg-[${getLineColor(event)}] justify-center items-center mx-auto`}/>
        );
    }

    const getLineColor = (event: ShipmentEvent) => {
        if (event.shipment.status.shipmentIsDelayed) return "#D43B1A";
        if (event.shipment.status.shipmentException) return "#F6A800";

        return "#428BCA";
    };

    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);

        return {
            date: format(date, 'MMMM do'),
            time: format(date, 'h:mm a')
        };
    };

    const groupedEvents = events.reduce((acc, event) => {
        const {date} = formatDate(event.eventDateTime);

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(event);

        return acc;
    }, {} as Record<string, ShipmentEvent[]>);

    return (
        <div>
            <div
                ref={stickyRef}
                className={`sticky top-0 bg-white lg:bg-transparent z-50 transition-shadow duration-300 lg:max-w-[190px] ${
                    isSticky ? 'shadow-md' : ''
                }`}
            >
                <div className="max-w-2xl text-black mx-auto px-4 py-6 md:mx-2 md:px-1 md:py1 md:max-w-[190px]">
                    <h1 className="text-xl leading-6 font-semibold lg:text-2xl lg:leading-7 lg:pl-24">Shipment history</h1>
                </div>
            </div>
            <div className="max-w-2xl mx-auto p-4 md:max-w-3xl md:mx-0 lg:mx-auto">
                <div className="space-y-1 relative">
                    {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                        <React.Fragment key={date}>
                            {dateEvents.map((event, eventIndex) => {
                                const {time} = formatDate(event.eventDateTime)
                                return (
                                    <div key={event.eventDateTime} className="flex relative">
                                        <div className="flex-none w-24 sm:w-40 text-right mr-4 md:flex md:w-48">
                                            {eventIndex === 0 ? (
                                                <>
                                                    <div className="text-[#1C355E] text-sm font-medium leading-4 md:mr-10">{date}</div>
                                                    <div className="text-black text-sm font-medium leading-4">{time}</div>
                                                </>
                                            ) : (
                                                <div className="text-black text-sm font-medium leading-4 md:w-full h-full md:pr-2 md:justify-start md:items-start text-right">{time}</div>
                                            )}
                                        </div>
                                        <div className={`justify-center items-center w-9 mr-4 z-10 h-full rounded-t-full rounded-b-full`}>
                                            {getStatusIcon(
                                                event.eventPosition.status,
                                                event
                                            )}
                                            <div className={`w-1 h-16 mt-0.5 mx-auto bg-[${getLineColor(event)}]`}/>
                                        </div>
                                        <div className="flex-grow pb-6 md:flex">
                                            <div className="md:w-[291px]">
                                                <h2 className="text-xl text-[#1C355E] font-semibold leading-6 capitalize">{event.eventPosition.status.toLowerCase()}</h2>
                                                {event.eventPosition.comments && (
                                                    <div className="mt-1">
                                                        <p className={`text-[#696F77] font-medium text-sm leading-4 ${!expandedComments[event.eventDateTime] && 'line-clamp-3'}`}>
                                                            {event.eventPosition.comments}
                                                        </p>
                                                        {event.eventPosition.comments.length > 150 && (
                                                            <button
                                                                onClick={() => toggleComment(event.eventDateTime)}
                                                                className="text-black hover:underline mt-1 text-sm"
                                                            >
                                                                {expandedComments[event.eventDateTime] ? 'View less' : 'View all'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-black mt-1 md:flex">
                                                <p className="font-medium text-sm capitalize leading-4">
                                                    {event.eventPosition.city.toLowerCase()}, <span className="uppercase">{event.eventPosition.country}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShipmentHistory;

