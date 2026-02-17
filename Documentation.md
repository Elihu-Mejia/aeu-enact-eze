# Project Overview: AEU Enact & Open Charge Map Integration

## Summary
I decided to use an army of Mechas of the fictional series **Mobile Suit Gundam 00**, this machine is developed by the **AEU (Advanced Eurpean Union)**, this is because electric vehicles are boring.

The **AEU Enact Eze** project aims to modernize the logistical support for the AEU Enact mobile suit series (specifically the *AEU-09 Enact* and its variants) by integrating them with the **Open Charge Map (OCM)** ecosystem. While the Enact primarily relies on solar energy generation via its orbital ring system, ground-based operations and extended combat deployments often require rapid auxiliary power replenishment. This project creates a digital bridge allowing Enact pilots to locate, reserve, and navigate to compatible high-voltage charging stations.

## Objectives
*   **Real-time Station Discovery:** Enable the Enact's onboard computer to query OCM for charging stations within a tactical radius.
*   **Compatibility Filtering:** Filter OCM results for stations capable of delivering the high voltage/amperage required by mobile suit capacitors (e.g., filtering for >350kW CCS or fictional "Orbital-Grade" connectors).
*   **Route Optimization:** Integrate charging stops into the Enact's tactical navigation overlay.
*   **Secure Communication:** Ensure location data of the mobile suit remains encrypted during API queries.

## 3. System Architecture

The solution utilizes a **NestJS** backend acting as a "Tactical Support Middleware" between the Mobile Suit and the public internet.

