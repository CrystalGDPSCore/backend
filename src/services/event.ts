import { EventType } from "@prisma/client";

import { db } from "../utils/db";

const prevMonday = new Date();
prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

const gteDailyDate = new Date(new Date().setHours(0, 0, 0, 0));
const lteDailyDate = new Date(new Date().setHours(24, 0, 0, 0));

const gteWeeklyDate = new Date(prevMonday.setHours(0, 0, 0, 0));
const lteWeeklyDate = new Date(prevMonday.setHours(168, 0, 0, 0));

export async function getEvent(type: EventType) {
    const gteDate = type == "Daily" ? gteDailyDate : gteWeeklyDate;
    const lteDate = type == "Daily" ? lteDailyDate : lteWeeklyDate;

    const event = await db.event.findFirst({
        where: {
            type,
            assignDate: {
                gte: gteDate,
                lte: lteDate
            }
        },
        orderBy: {
            assignDate: "desc"
        }
    });

    return event;
}

export async function getEventLevel(type: EventType) {
    const gteDate = type == "Daily" ? gteDailyDate : gteWeeklyDate;
    const lteDate = type == "Daily" ? lteDailyDate : lteWeeklyDate;
    
    const event = await db.event.findFirst({
        where: {
            type,
            assignDate: {
                gte: gteDate,
                lte: lteDate
            }
        },
        orderBy: {
            assignDate: "desc"
        }
    });

    if (!event) {
        return null;
    }

    const level = await db.level.findUnique({
        where: {
            id: event.levelId
        }
    });

    return level;
}

export async function getEventLevelIds(type: EventType, offset: number) {
    const ltDate = type == "Daily" ? gteDailyDate : gteWeeklyDate;

    const events = await db.event.findMany({
        where: {
            type,
            assignDate: {
                lt: ltDate
            }
        },
        take: 10,
        skip: offset,
        orderBy: {
            assignDate: "desc"
        }
    });

    const eventLevelIds = events.map(level => level.levelId);

    return eventLevelIds;
}