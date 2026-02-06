import type satori from "satori";

type SatoriElement = Parameters<typeof satori>[0];

export type OgpTemplateData = {
  title: string;
  siteName: string;
};

const calcTitleFontSize = (title: string): number => {
  const len = title.length;
  if (len > 50) return 36;
  if (len > 30) return 44;
  return 52;
};

export const createOgpTemplate = (data: OgpTemplateData): SatoriElement => {
  const titleFontSize = calcTitleFontSize(data.title);

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        fontFamily: "Noto Sans JP",
      },
      children: [
        // Accent bar
        {
          type: "div",
          props: {
            style: {
              width: "100%",
              height: "8px",
              backgroundColor: "#007a9e",
            },
          },
        },
        // Content area
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              padding: "60px 80px 40px",
            },
            children: [
              // Title
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    width: "100%",
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        fontSize: titleFontSize,
                        fontWeight: 700,
                        color: "#113340",
                        textAlign: "center",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      },
                      children: data.title,
                    },
                  },
                },
              },
              // Site name
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    paddingTop: "20px",
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 24,
                        fontWeight: 400,
                        color: "#007a9e",
                      },
                      children: data.siteName,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
};
