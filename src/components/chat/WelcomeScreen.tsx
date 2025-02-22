import { Box, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

interface WelcomeScreenProps {
  onNewChat: () => void;
  onQuickStart: (message: string) => void;
}

const WelcomeScreen = ({ onNewChat, onQuickStart }: WelcomeScreenProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        p: 4,
        gap: 6,
        mt: -4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Medi'ye Hoş Geldiniz
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          İlaçlarınızı düzenli kullanmanıza yardımcı olan, sağlık takibinizi
          kolaylaştıran ve 7/24 yanınızda olan akıllı sağlık asistanınız. Size
          nasıl yardımcı olabilirim?
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          width: "100%",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<AccessTimeIcon />}
          onClick={() =>
            onQuickStart("İlaç hatırlatıcısı nasıl ayarlayabilirim?")
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
            maxWidth: "100%",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              İlaç Hatırlatıcısı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Günlük ilaç takibiniz için hatırlatıcı ayarlayın
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<FamilyRestroomIcon />}
          onClick={() =>
            onQuickStart("Yakınlarımla nasıl bağlantı kurabilirim?")
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Yakınlarla Bağlantı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aileniz ve bakıcılarınızla iletişim kurun
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<LocalHospitalIcon />}
          onClick={() =>
            onQuickStart("Sağlık profesyoneline ne zaman başvurmalıyım?")
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Sağlık Desteği
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ne zaman doktora başvurmanız gerektiğini öğrenin
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<LiveHelpIcon />}
          onClick={() => onQuickStart("Medi'nin özellikleri nelerdir?")}
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Genel Yardım
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Medi'nin tüm özelliklerini keşfedin
            </Typography>
          </Box>
        </Button>
      </Box>

      <Button
        variant="contained"
        startIcon={<QuestionAnswerIcon />}
        onClick={onNewChat}
        sx={{
          mt: 4,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "1.1rem",
        }}
      >
        Kendi Sorunuzu Sorun
      </Button>
    </Box>
  );
};

export default WelcomeScreen;
